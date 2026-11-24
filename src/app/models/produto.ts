import { Categoria } from './categoria';

export interface ProdutoDados {
  nome: string;
  preco: number;
  categoriaId: number;
  codigoBarras?: string | null;
}

export interface Produto extends ProdutoDados {
  id: number;
}

// Alguns controllers retornam o ID direto. Outros retornam a categoria relacionada.
export type ProdutoResposta = Omit<Produto, 'categoriaId'> & {
  categoriaId?: number;
  categoria?: Pick<Categoria, 'id'>;
};
