import { Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';
import { NotificacaoService } from './services/notificacao.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  template: `
    <a class="pular" href="#conteudo">Ir para o conteúdo</a>
    <div class="app-shell" [class.menu-aberto]="menuAberto()">
      <app-sidebar (fecharMenu)="menuAberto.set(false)" />
      <app-header [menuAberto]="menuAberto()" (abrirMenu)="menuAberto.set(true)" />
      <main id="conteudo" class="page-content" tabindex="-1"><router-outlet /></main>
    </div>
    @if (menuAberto()) {
      <button type="button" class="menu-backdrop" aria-label="Fechar menu lateral" (click)="menuAberto.set(false)"></button>
    }
    @if (notificacao.mensagem()) {
      <div class="notificacao" role="status">
        <span>{{ notificacao.mensagem() }}</span>
        <button type="button" aria-label="Fechar notificação" (click)="notificacao.fechar()">×</button>
      </div>
    }
  `,
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly notificacao = inject(NotificacaoService);
  protected readonly menuAberto = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(() => this.menuAberto.set(false));
  }

  @HostListener('document:keydown.escape')
  protected fecharMenuComEscape() {
    this.menuAberto.set(false);
  }
}
