import { Component, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" id="menu-lateral" aria-label="Menu principal">
      <div class="sidebar-topo">
      <a class="brand" routerLink="/dashboard" aria-label="Mercatto, ir para o Dashboard" (click)="fecharMenu.emit()">
        <span class="brand-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="M3 7v10l9 5 9-5V7M12 12v10"/></svg>
        </span>
        <span><strong>EstoqueUp</strong><small>GESTÃO DE ESTOQUE</small></span>
      </a>
      <button type="button" class="menu-fechar" aria-label="Fechar menu lateral" (click)="fecharMenu.emit()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7M8 12h12"/></svg>
      </button>
      </div>
      <nav class="sidebar-nav" aria-label="Navegação principal">
        <span class="nav-caption">MENU PRINCIPAL</span>
        <a routerLink="/dashboard" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="fecharMenu.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </a>
        <a routerLink="/catalogo" routerLinkActive="active" class="catalogo-link" ariaCurrentWhenActive="page" (click)="fecharMenu.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11V5a2 2 0 0 1 2-2h6l10 10-8 8L3 11Z"/><circle cx="8" cy="8" r="1"/></svg>
          Catálogo
        </a>
        <div class="estoque-menu" routerLinkActive="stock-active">
          <button type="button" class="estoque-toggle"
            [attr.aria-expanded]="estoqueAberto()" aria-controls="estoque-links"
            (click)="estoqueAberto.set(!estoqueAberto())">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
            <span>Estoque</span>
            <svg class="estoque-chevron" [class.aberto]="estoqueAberto()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div class="estoque-links" id="estoque-links" [hidden]="!estoqueAberto()">
            <a routerLink="/produtos" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="fecharMenu.emit()">Produtos</a>
            <a routerLink="/categorias" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="fecharMenu.emit()">Categorias</a>
          </div>
        </div>
      </nav>
      <div class="sidebar-footer">Sistema de Gestão de Estoque</div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly fecharMenu = output<void>();
  protected readonly estoqueAberto = signal(true);
}
