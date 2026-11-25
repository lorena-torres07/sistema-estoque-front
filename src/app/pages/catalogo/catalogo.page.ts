import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { Produto } from '../../models/produto';
import { CatalogoApi } from '../../services/catalogo-api';
import { brl, compararNomes, mensagemErro, normalizarNome } from '../shared/catalogo-ui';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrl: './catalogo.page.css',
})
export class CatalogoPage {
  private readonly api = inject(CatalogoApi);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly busca = signal('');
  protected readonly categoriaId = signal<number | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly moeda = brl;

  protected readonly categoriasPorId = computed(() => new Map(this.categorias().map(item => [item.id, item.nome])));
  protected readonly encontrados = computed(() => {
    const termo = normalizarNome(this.busca());
    const codigo = this.busca().trim();
    return this.produtos().filter(item =>
      (this.categoriaId() === null || item.categoriaId === this.categoriaId()) &&
      (normalizarNome(item.nome).includes(termo) || (item.codigoBarras ?? `#${item.id}`).includes(codigo)),
    );
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.busca.set(params.get('busca') ?? '');
    });
    this.carregar();
  }

  protected carregar() {
    this.carregando.set(true);
    this.erro.set('');
    forkJoin({ produtos: this.api.listarProdutos(), categorias: this.api.listarCategorias() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ produtos, categorias }) => {
          this.produtos.set(produtos.toSorted((a, b) => compararNomes(a.nome, b.nome)));
          this.categorias.set(categorias.toSorted((a, b) => compararNomes(a.nome, b.nome)));
          this.carregando.set(false);
        },
        error: erro => {
          this.erro.set(mensagemErro(erro, 'Não foi possível carregar o catálogo.'));
          this.carregando.set(false);
        },
      });
  }

  protected codigo(produto: Produto) {
    return produto.codigoBarras || `#${produto.id}`;
  }
}
