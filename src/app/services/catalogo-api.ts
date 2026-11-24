import { HttpClient } from '@angular/common/http';
import { InjectionToken, inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Categoria, CategoriaDados } from '../models/categoria';
import { ProdutoDados, ProdutoResposta } from '../models/produto';

export const CATALOGO_API_URL = new InjectionToken<string>('URL da API do catálogo', {
  providedIn: 'root',
  factory: () => '/api',
});

@Injectable({ providedIn: 'root' })
export class CatalogoApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(CATALOGO_API_URL).replace(/\/$/, '');

  listarProdutos() {
    return this.http.get<ProdutoResposta[]>(`${this.base}/produtos`).pipe(
      map(produtos => produtos.map(produto => {
        const categoriaId = produto.categoriaId ?? produto.categoria?.id;
        if (categoriaId == null) {
          throw new Error('O produto retornado pela API não tem uma categoria identificável.');
        }
        return { ...produto, categoriaId };
      })),
    );
  }

  salvarProduto(id: number | null, dados: ProdutoDados) {
    const url = `${this.base}/produtos`;
    return id === null ? this.http.post<unknown>(url, dados) : this.http.put<unknown>(`${url}/${id}`, dados);
  }

  excluirProduto(id: number) {
    return this.http.delete<void>(`${this.base}/produtos/${id}`);
  }

  listarCategorias() {
    return this.http.get<Categoria[]>(`${this.base}/categorias`);
  }

  salvarCategoria(id: number | null, dados: CategoriaDados) {
    const url = `${this.base}/categorias`;
    return id === null ? this.http.post<unknown>(url, dados) : this.http.put<unknown>(`${url}/${id}`, dados);
  }

  excluirCategoria(id: number) {
    return this.http.delete<void>(`${this.base}/categorias/${id}`);
  }
}
