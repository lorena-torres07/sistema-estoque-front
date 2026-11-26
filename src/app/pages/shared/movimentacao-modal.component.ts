import { ChangeDetectorRef, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produto } from '../../models/produto';
import { CatalogoApi } from '../../services/catalogo-api';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-movimentacao-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './movimentacao-modal.component.html',
  styleUrl: '../../pages/shared/catalogo.css',
})
export class MovimentacaoModalComponent {
  private readonly api = inject(CatalogoApi);
  private readonly notificacao = inject(NotificacaoService);
  private readonly detector = inject(ChangeDetectorRef);
  private readonly forms = inject(FormBuilder);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly ocupado = signal(false);
  protected readonly erroDialogo = signal('');

 
  protected readonly form = this.forms.nonNullable.group({
    produtoId: this.forms.control<number | null>(null, Validators.required),
    tipo: ['ENTRADA', Validators.required], 
    quantidade: ['1', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    observacao: ['', [Validators.maxLength(200)]],
  });

  abrirForm() {
    this.erroDialogo.set('');
    this.form.reset({
      produtoId: null,
      tipo: 'ENTRADA',
      quantidade: '1',
      observacao: '',
    });


    this.api.listarProdutos().subscribe({
      next: lista => this.produtos.set(lista),
      error: () => {
        this.produtos.set([{ id: 1, nome: 'Café torrado 500g (Teste)' } as Produto]);
      }
    });

    this.detector.detectChanges();
    this.dialogo().nativeElement.showModal();
  }

  fechar() {
    if (!this.ocupado()) {
      this.dialogo().nativeElement.close();
    }
  }

  cancelar(event: Event) {
    if (this.ocupado()) {
      event.preventDefault();
    }
  }

  salvar() {
    if (this.ocupado()) return;
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const dados = this.form.getRawValue();
    console.log('Dados da movimentação prontos para o back-end:', dados);


    this.fechar();
    this.notificacao.mostrar('Movimentação registrada.');
  }
}