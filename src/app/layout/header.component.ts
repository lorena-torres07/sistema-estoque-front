import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="header-heading">
        <strong>{{ titulo() }}</strong>
        <span>{{ subtitulo() }}</span>
      </div>
      <form class="header-search" role="search" (submit)="buscar($event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
        <label class="sr-only" for="busca-global">Buscar produto por nome ou código</label>
        <input id="busca-global" type="search" name="busca" placeholder="Buscar produto por nome ou código..." [value]="busca()" (input)="busca.set(campo.value)" #campo>
        <button type="submit" aria-label="Buscar produtos">Buscar</button>
      </form>
    </header>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  protected readonly busca = signal('');
  private readonly rota = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects.split('?')[0]),
  ), { initialValue: this.router.url.split('?')[0] });
  protected readonly titulo = computed(() => {
    switch (this.rota()) {
      case '/produtos': return 'Produtos';
      case '/categorias': return 'Categorias';
      default: return 'Dashboard';
    }
  });
  protected readonly subtitulo = computed(() => this.rota() === '/dashboard' || this.rota() === '/'
    ? 'Visão geral do estoque' : 'Catálogo de produtos');

  protected buscar(event: Event) {
    event.preventDefault();
    const termo = this.busca().trim();
    void this.router.navigate(['/produtos'], { queryParams: termo ? { busca: termo } : {} });
  }
}
