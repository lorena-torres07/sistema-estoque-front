import { Routes } from '@angular/router';

export const catalogoRoutes: Routes = [
  {
    path: 'produtos',
    title: 'Produtos · Gestão de Estoque',
    loadComponent: () => import('./pages/produtos/produtos.page').then(m => m.ProdutosPage),
  },
  {
    path: 'categorias',
    title: 'Categorias · Gestão de Estoque',
    loadComponent: () => import('./pages/categorias/categorias.page').then(m => m.CategoriasPage),
  },
];
