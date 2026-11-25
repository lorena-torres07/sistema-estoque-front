import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardApi, MovimentacaoResumo, ProdutoEstoque } from '../../services/dashboard-api';
import { mensagemErro } from '../shared/catalogo-ui';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly numeros = new Intl.NumberFormat('pt-BR');
  private readonly datas = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  protected readonly produtos = signal<ProdutoEstoque[]>([]);
  protected readonly estoqueBaixo = signal<ProdutoEstoque[]>([]);
  protected readonly movimentacoes = signal<MovimentacaoResumo[]>([]);
  protected readonly carregando = signal(true);
  protected readonly carregandoMovimentacoes = signal(true);
  protected readonly erro = signal('');
  protected readonly erroMovimentacoes = signal('');
  protected readonly alertasExpandidos = signal(false);
  protected readonly totalProdutos = computed(() => this.produtos().length);
  protected readonly unidadesEmEstoque = computed(() =>
    this.produtos().reduce((total, produto) => total + produto.quantidadeEmEstoque, 0));
  protected readonly alertasVisiveis = computed(() => this.alertasExpandidos()
    ? this.estoqueBaixo() : this.estoqueBaixo().slice(0, 5));
  protected readonly movimentosRecentes = computed(() => this.movimentacoes().slice(0, 5));

  constructor() {
    this.carregar();
  }

  protected carregar() {
    this.carregando.set(true);
    this.erro.set('');
    forkJoin({ produtos: this.api.listarProdutos(), estoqueBaixo: this.api.listarEstoqueBaixo() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ produtos, estoqueBaixo }) => {
          this.produtos.set(produtos);
          this.estoqueBaixo.set(estoqueBaixo);
          this.carregando.set(false);
        },
        error: erro => {
          this.erro.set(mensagemErro(erro, 'Não foi possível carregar os indicadores do estoque.'));
          this.carregando.set(false);
        },
      });
    this.carregarMovimentacoes();
  }

  protected carregarMovimentacoes() {
    this.carregandoMovimentacoes.set(true);
    this.erroMovimentacoes.set('');
    this.api.listarMovimentacoes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: movimentacoes => {
        this.movimentacoes.set(movimentacoes);
        this.carregandoMovimentacoes.set(false);
      },
      error: erro => {
        this.erroMovimentacoes.set(mensagemErro(erro, 'Não foi possível carregar as movimentações.'));
        this.carregandoMovimentacoes.set(false);
      },
    });
  }

  protected numero(valor: number) {
    return this.numeros.format(valor);
  }

  protected data(valor: string) {
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? 'Data indisponível' : this.datas.format(data);
  }
}
