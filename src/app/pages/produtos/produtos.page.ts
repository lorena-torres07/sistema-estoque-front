import { ChangeDetectorRef, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { Produto } from '../../models/produto';
import { CatalogoApi } from '../../services/catalogo-api';
import { NotificacaoService } from '../../services/notificacao.service';
import { brl, compararNomes, lerPreco, mensagemErro, normalizarNome, validarPreco } from '../shared/catalogo-ui';

@Component({
  selector: 'app-produtos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produtos.page.html',
  styleUrl: '../shared/catalogo.css',
})
export class ProdutosPage {
  private readonly api = inject(CatalogoApi);
  private readonly notificacao = inject(NotificacaoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly forms = inject(FormBuilder);
  private readonly params = toSignal(this.route.queryParamMap);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly busca = signal('');
  protected readonly pagina = signal(1);
  protected readonly tamanhoPagina = 8;
  protected readonly carregando = signal(true);
  protected readonly falha = signal('');
  protected readonly erroDialogo = signal('');
  protected readonly ocupado = signal(false);
  protected readonly editando = signal<Produto | null>(null);
  protected readonly removendo = signal<Produto | null>(null);
  protected readonly detalhando = signal<Produto | null>(null);
  protected readonly moeda = brl;

  protected readonly categoriaSelecionada = computed(() => {
    const id = Number(this.params()?.get('categoria'));
    return this.categorias().find(categoria => categoria.id === id)?.id ?? null;
  });
  protected readonly filtroEstoqueBaixo = computed(() => this.params()?.get('estoque') === 'baixo');
  protected readonly categoriasPorId = computed(() => new Map(this.categorias().map(item => [item.id, item.nome])));
  protected readonly visiveis = computed(() => {
    const termo = normalizarNome(this.busca());
    const id = this.categoriaSelecionada();
    return this.produtos().filter(item =>
      (id === null || item.categoriaId === id) &&
      (!this.filtroEstoqueBaixo() || item.quantidadeEmEstoque <= item.estoqueMinimo) &&
      (normalizarNome(item.nome).includes(termo) || (item.codigoBarras ?? '').includes(this.busca().trim())),
    );
  });
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

  protected readonly form = this.forms.nonNullable.group({
    nome: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    preco: ['', [Validators.required, validarPreco]],
    estoqueMinimo: ['0', [Validators.required, Validators.pattern(/^\d+$/), Validators.max(2147483647)]],
    quantidadeEstoque: ['0', [Validators.required, Validators.pattern(/^\d+$/), Validators.max(2147483647)]],
    categoriaId: this.forms.control<number | null>(null, Validators.required),
    codigoBarras: ['', [Validators.pattern(/^\d{8,14}$/)]],
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.busca.set(params.get('busca') ?? '');
      this.pagina.set(1);
    });
    this.carregar();
  }

  protected carregar() {
    this.carregando.set(true);
    this.falha.set('');
    forkJoin({ produtos: this.api.listarProdutos(), categorias: this.api.listarCategorias() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ produtos, categorias }) => {
          this.produtos.set(produtos.toSorted((a, b) => compararNomes(a.nome, b.nome)));
          this.categorias.set(categorias.toSorted((a, b) => compararNomes(a.nome, b.nome)));
          this.carregando.set(false);
        },
        error: erro => {
          this.falha.set(mensagemErro(erro, 'Não foi possível carregar o catálogo.'));
          this.carregando.set(false);
        },
      });
  }

  protected filtrarCategoria(valor: string) {
    this.pagina.set(1);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: valor || null, busca: this.busca().trim() || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected limparFiltros() {
    this.busca.set('');
    this.pagina.set(1);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { busca: null, categoria: null, estoque: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected buscar(valor: string) {
    this.busca.set(valor);
    this.pagina.set(1);
  }

  protected irParaPagina(numero: number) {
    this.pagina.set(Math.max(1, Math.min(numero, this.totalPaginas())));
  }

  protected codigo(produto: Produto) {
    return produto.codigoBarras || `#${produto.id}`;
  }

  protected abrirForm(produto: Produto | null = null) {
    this.removendo.set(null);
    this.detalhando.set(null);
    this.editando.set(produto);
    this.erroDialogo.set('');
    this.form.reset({
      nome: produto?.nome ?? '',
      preco: produto ? String(produto.preco).replace('.', ',') : '',
      estoqueMinimo: String(produto?.estoqueMinimo ?? 0),
      quantidadeEstoque: String(produto?.quantidadeEmEstoque ?? 0),
      categoriaId: produto?.categoriaId ?? this.categoriaSelecionada(),
      codigoBarras: produto?.codigoBarras ?? '',
    });
    this.mostrarDialogo();
  }

  protected abrirExclusao(produto: Produto) {
    this.erroDialogo.set('');
    this.detalhando.set(null);
    this.removendo.set(produto);
    this.mostrarDialogo();
  }

  protected abrirDetalhes(produto: Produto) {
    this.removendo.set(null);
    this.detalhando.set(produto);
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
    const { nome, preco: precoDigitado, estoqueMinimo, quantidadeEstoque, categoriaId, codigoBarras } = this.form.getRawValue();
    const preco = lerPreco(precoDigitado);
    if (this.form.invalid || preco === null || categoriaId === null) return;
    if (!this.categoriasPorId().has(categoriaId)) {
      this.erroDialogo.set('Selecione uma categoria disponível.');
      return;
    }
    const id = this.editando()?.id ?? null;
    this.ocupado.set(true);
    this.erroDialogo.set('');
    this.api.salvarProduto(id, {
      nome: nome.trim(), preco, estoqueMinimo: Number(estoqueMinimo), categoriaId,
      codigoBarras: codigoBarras || null,
      ...(id === null
        ? { quantidadeInicial: Number(quantidadeEstoque) }
        : { quantidadeEmEstoque: Number(quantidadeEstoque) }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.finalizar(id === null ? 'Produto cadastrado.' : 'Produto atualizado.'),
        error: erro => this.reportarErro(erro, 'Não foi possível salvar o produto.'),
      });
  }

  protected excluir(produto: Produto) {
    if (this.ocupado()) return;
    this.ocupado.set(true);
    this.erroDialogo.set('');
    this.api.excluirProduto(produto.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.finalizar('Produto excluído.'),
      error: erro => this.reportarErro(erro, 'Não foi possível excluir o produto.'),
    });
  }

  private reportarErro(erro: unknown, padrao: string) {
    this.ocupado.set(false);
    this.erroDialogo.set(mensagemErro(erro, padrao));
  }

  private mostrarDialogo() {
    this.detector.detectChanges();
    this.dialogo().nativeElement.showModal();
  }

  private finalizar(aviso: string) {
    this.ocupado.set(false);
    this.fechar();
    this.notificacao.mostrar(aviso);
    this.carregar();
  }
}
