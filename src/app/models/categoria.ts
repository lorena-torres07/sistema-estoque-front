export interface CategoriaDados {
  nome: string;
  descricao?: string;
}

export interface Categoria extends CategoriaDados {
  id: number;
}
