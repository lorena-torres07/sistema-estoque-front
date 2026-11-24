import { ChangeDetectorRef, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { CatalogoApi } from '../../services/catalogo-api';
import { compararNomes, iniciais, mensagemErro } from '../shared/catalogo-ui';

@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorias.page.html',
  styleUrl: '../shared/catalogo.css',
})
export class CategoriasPage {
  private readonly api = inject(CatalogoApi);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly produtosPorCategoria = signal(new Map<number, number>());
  protected readonly carregando = signal(true);
  protected readonly falha = signal('');
  protected readonly aviso = signal('');
  protected readonly erroDialogo = signal('');
  protected readonly ocupado = signal(false);
  protected readonly editando = signal<Categoria | null>(null);
  protected readonly removendo = signal<Categoria | null>(null);
  protected readonly iniciais = iniciais;
  protected readonly vazias = computed(() => this.categorias().filter(item => !this.total(item.id)).length);

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

  protected abrirForm(categoria: Categoria | null = null) {
    this.removendo.set(null);
    this.editando.set(categoria);
    this.erroDialogo.set('');
    this.form.reset({ nome: categoria?.nome ?? '', descricao: categoria?.descricao ?? '' });
    this.mostrarDialogo();
  }

  protected abrirExclusao(categoria: Categoria) {
    this.erroDialogo.set('');
    this.removendo.set(categoria);
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
    this.aviso.set(aviso);
    this.carregar();
  }
}
