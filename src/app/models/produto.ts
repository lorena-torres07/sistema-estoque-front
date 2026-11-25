import { Categoria } from './categoria';

export interface ProdutoDados {
  nome: string;
  preco: number;
  categoriaId: number;
  estoqueMinimo: number;
  quantidadeInicial?: number;
  quantidadeEmEstoque?: number;
  codigoBarras?: string | null;
}

export interface Produto extends ProdutoDados {
  id: number;
  quantidadeEmEstoque: number;
}

// Alguns controllers retornam o ID direto. Outros retornam a categoria relacionada.
export type ProdutoResposta = Omit<Produto, 'categoriaId'> & {
  categoriaId?: number;
  categoria?: Pick<Categoria, 'id'>;
};
