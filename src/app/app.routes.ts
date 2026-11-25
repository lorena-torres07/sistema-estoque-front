import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard · Mercatto',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
  {
    path: 'catalogo',
    title: 'Catálogo de Produtos · Mercatto',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage),
  },
  {
    path: 'produtos',
    title: 'Produtos · Mercatto',
    loadComponent: () => import('./pages/produtos/produtos.page').then(m => m.ProdutosPage),
  },
  {
    path: 'categorias',
    title: 'Categorias · Mercatto',
    loadComponent: () => import('./pages/categorias/categorias.page').then(m => m.CategoriasPage),
  },
  { path: '**', redirectTo: 'dashboard' },
];
