import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

export const compararNomes = new Intl.Collator('pt-BR', { sensitivity: 'base' }).compare;
export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function normalizarNome(nome: string) {
  return nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR').trim();
}

export function iniciais(nome: string) {
  const [primeira = nome.trim(), segunda = ''] = nome.match(/[\p{L}\p{N}]+/gu) ?? [];
  const abreviacao = segunda ? primeira.slice(0, 1) + segunda.slice(0, 1) : primeira.slice(0, 2);
  return abreviacao.toLocaleUpperCase('pt-BR');
}

export function lerPreco(valor: string) {
  const texto = valor.trim().replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(texto) && Number.isFinite(Number(texto)) ? Number(texto) : null;
}

export function validarPreco(control: AbstractControl) {
  return lerPreco(control.value) === null ? { precoInvalido: true } : null;
}

export function mensagemErro(erro: unknown, padrao: string) {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) return 'A API está inacessível. Verifique a conexão e tente de novo.';
    const mensagem: unknown = erro.error?.mensagem ?? erro.error?.detail ?? erro.error?.message;
    if (erro.status >= 400 && erro.status < 500 && typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }
  }
  return padrao;
}
