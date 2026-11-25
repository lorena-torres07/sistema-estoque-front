import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  readonly mensagem = signal('');
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  mostrar(mensagem: string) {
    if (this.temporizador !== null) clearTimeout(this.temporizador);
    this.mensagem.set(mensagem);
    this.temporizador = setTimeout(() => this.fechar(), 5000);
  }

  fechar() {
    if (this.temporizador !== null) clearTimeout(this.temporizador);
    this.temporizador = null;
    this.mensagem.set('');
  }
}
