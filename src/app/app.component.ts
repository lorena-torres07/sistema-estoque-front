import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  template: `
    <a class="pular" href="#conteudo">Ir para o conteúdo</a>
    <div class="app-shell">
      <app-sidebar />
      <app-header />
      <main id="conteudo" class="page-content" tabindex="-1"><router-outlet /></main>
    </div>
  `,
})
export class AppComponent {}
