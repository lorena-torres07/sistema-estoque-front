import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <a class="pular" href="#conteudo" (click)="$event.preventDefault(); conteudo.focus()">Ir para o conteúdo</a>
    <header class="faixa">
      <div class="moldura topo">
        <a class="marca" routerLink="/produtos">
          <span class="gondola" aria-hidden="true"><i></i><i></i><i></i></span>
          Gestão de Estoque
        </a>
      </div>
    </header>
    <div class="moldura">
      <nav class="abas" aria-label="Cadastros do catálogo">
        <a routerLink="/produtos" routerLinkActive="ativa" ariaCurrentWhenActive="page">Produtos</a>
        <a routerLink="/categorias" routerLinkActive="ativa" ariaCurrentWhenActive="page">Categorias</a>
      </nav>
      <main #conteudo id="conteudo" tabindex="-1"><router-outlet /></main>
    </div>
  `,
})
export class AppComponent {}
