import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { catalogoRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', pathMatch: 'full', redirectTo: 'produtos' },
      ...catalogoRoutes,
      { path: '**', redirectTo: 'produtos' },
    ]),
  ],
}).catch(console.error);
