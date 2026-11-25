import { ChangeDetectorRef, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { CatalogoApi } from '../../services/catalogo-api';
import { NotificacaoService } from '../../services/notificacao.service';
import { compararNomes, mensagemErro, normalizarNome } from '../shared/catalogo-ui';

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorias.page.html',
  styleUrl: '../shared/catalogo.css',
})
export class CategoriasPage {
  private readonly api = inject(CatalogoApi);
  private readonly notificacao = inject(NotificacaoService);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly produtosPorCategoria = signal(new Map<number, number>());
  protected readonly totalProdutos = signal(0);
  protected readonly busca = signal('');
  protected readonly pagina = signal(1);
  protected readonly tamanhoPagina = 5;
  protected readonly carregando = signal(true);
  protected readonly falha = signal('');
  protected readonly erroDialogo = signal('');
  protected readonly ocupado = signal(false);
  protected readonly editando = signal<Categoria | null>(null);
  protected readonly removendo = signal<Categoria | null>(null);
  protected readonly detalhando = signal<Categoria | null>(null);
  protected readonly visiveis = computed(() => this.categorias().filter(item =>
    normalizarNome(item.nome).includes(normalizarNome(this.busca())),
  ));
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.visiveis().length / this.tamanhoPagina)));
  protected readonly paginaAtual = computed(() => Math.min(this.pagina(), this.totalPaginas()));
  protected readonly paginasVisiveis = computed(() => {
    const atual = this.paginaAtual();
    const total = this.totalPaginas();
    const inicio = Math.max(1, Math.min(atual - 1, total - 2));
    return Array.from({ length: Math.min(3, total - inicio + 1) }, (_, indice) => inicio + indice);
  });
  protected readonly itensPagina = computed(() => this.visiveis().slice(
    (this.paginaAtual() - 1) * this.tamanhoPagina,
    this.paginaAtual() * this.tamanhoPagina,
  ));
  protected readonly primeiroItem = computed(() => this.visiveis().length ? (this.paginaAtual() - 1) * this.tamanhoPagina + 1 : 0);
  protected readonly ultimoItem = computed(() => Math.min(this.paginaAtual() * this.tamanhoPagina, this.visiveis().length));

  protected readonly form = inject(FormBuilder).nonNullable.group({
    nome: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
    descricao: ['', Validators.maxLength(200)],
  });

  constructor() {
    this.carregar();
  }

  protected carregar() {
    this.carregando.set(true);
    this.falha.set('');
    forkJoin({ categorias: this.api.listarCategorias(), produtos: this.api.listarProdutos() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categorias, produtos }) => {
          const totais = new Map<number, number>();
          for (const item of produtos) {
            totais.set(item.categoriaId, (totais.get(item.categoriaId) ?? 0) + 1);
          }
          this.produtosPorCategoria.set(totais);
          this.totalProdutos.set(produtos.length);
          this.categorias.set(categorias.toSorted((a, b) => compararNomes(a.nome, b.nome)));
          this.carregando.set(false);
        },
        error: erro => {
          this.falha.set(mensagemErro(erro, 'Não foi possível carregar as categorias.'));
          this.carregando.set(false);
        },
      });
  }

  protected total(id: number) {
    return this.produtosPorCategoria().get(id) ?? 0;
  }

  protected buscar(valor: string) {
    this.busca.set(valor);
    this.pagina.set(1);
  }

  protected irParaPagina(numero: number) {
    this.pagina.set(Math.max(1, Math.min(numero, this.totalPaginas())));
  }

  protected abrirForm(categoria: Categoria | null = null) {
    this.removendo.set(null);
    this.detalhando.set(null);
    this.editando.set(categoria);
    this.erroDialogo.set('');
    this.form.reset({ nome: categoria?.nome ?? '', descricao: categoria?.descricao ?? '' });
    this.mostrarDialogo();
  }

  protected abrirExclusao(categoria: Categoria) {
    this.erroDialogo.set('');
    this.detalhando.set(null);
    this.removendo.set(categoria);
    this.mostrarDialogo();
  }

  protected abrirDetalhes(categoria: Categoria) {
    this.removendo.set(null);
    this.detalhando.set(categoria);
    this.mostrarDialogo();
  }

  protected fechar() {
    if (!this.ocupado()) this.dialogo().nativeElement.close();
  }

  protected cancelar(event: Event) {
    if (this.ocupado()) event.preventDefault();
  }

  protected salvar() {
    if (this.ocupado()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { nome, descricao } = this.form.getRawValue();
    const id = this.editando()?.id ?? null;
    this.ocupado.set(true);
    this.erroDialogo.set('');
    this.api.salvarCategoria(id, { nome: nome.trim(), descricao: descricao.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.finalizar(id === null ? 'Categoria cadastrada.' : 'Categoria atualizada.'),
        error: erro => this.reportarErro(erro, 'Não foi possível salvar a categoria.'),
      });
  }

  protected excluir(categoria: Categoria) {
    if (this.ocupado() || this.total(categoria.id)) return;
    this.ocupado.set(true);
    this.erroDialogo.set('');
    this.api.excluirCategoria(categoria.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.finalizar('Categoria excluída.'),
      error: erro => this.reportarErro(erro, 'Não foi possível excluir a categoria.'),
    });
  }

  private mostrarDialogo() {
    this.detector.detectChanges();
    this.dialogo().nativeElement.showModal();
  }

  private reportarErro(erro: unknown, padrao: string) {
    this.ocupado.set(false);
    this.erroDialogo.set(mensagemErro(erro, padrao));
  }

  private finalizar(aviso: string) {
    this.ocupado.set(false);
    this.fechar();
    this.notificacao.mostrar(aviso);
    this.carregar();
  }
}
