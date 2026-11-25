import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CATALOGO_API_URL } from './catalogo-api';

export interface ProdutoEstoque {
  id: number;
  nome: string;
  codigoBarras: string | null;
  categoriaNome: string;
  quantidadeEmEstoque: number;
  estoqueMinimo: number;
}

export interface MovimentacaoResumo {
  id: number;
  produtoId: number;
  produtoNome: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  dataMovimentacao: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(CATALOGO_API_URL).replace(/\/$/, '');

  listarProdutos() {
    return this.http.get<ProdutoEstoque[]>(`${this.base}/produtos`);
  }

  listarEstoqueBaixo() {
    return this.http.get<ProdutoEstoque[]>(`${this.base}/produtos/estoque-baixo`);
  }

  listarMovimentacoes() {
    return this.http.get<MovimentacaoResumo[]>(`${this.base}/movimentacoes`);
  }
}
