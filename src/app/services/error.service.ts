import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private erro$ = new BehaviorSubject<string | null>(null);
  erro = this.erro$.asObservable();

  mostrar(mensagem: string) {
    this.erro$.next(mensagem);
  }

  fechar() {
    this.erro$.next(null);
  }
}
