import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" aria-label="Menu principal">
      <a class="brand" routerLink="/dashboard" aria-label="Mercatto, ir para o Dashboard">
        <span class="brand-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="M3 7v10l9 5 9-5V7M12 12v10"/></svg>
        </span>
        <span><strong>Mercatto</strong><small>GESTÃO DE ESTOQUE</small></span>
      </a>
      <nav class="sidebar-nav" aria-label="Navegação principal">
        <span class="nav-caption">MENU PRINCIPAL</span>
        <a routerLink="/dashboard" routerLinkActive="active" ariaCurrentWhenActive="page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </a>
        <span class="nav-caption nav-group">CATÁLOGO</span>
        <a routerLink="/produtos" routerLinkActive="active" ariaCurrentWhenActive="page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11V5a2 2 0 0 1 2-2h6l10 10-8 8L3 11Z"/><circle cx="8" cy="8" r="1"/></svg>
          Produtos
        </a>
        <a routerLink="/categorias" routerLinkActive="active" ariaCurrentWhenActive="page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h18M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M8 12h8"/></svg>
          Categorias
        </a>
      </nav>
      <div class="sidebar-footer">Sistema de Gestão de Estoque</div>
    </aside>
  `,
})
export class SidebarComponent {}
