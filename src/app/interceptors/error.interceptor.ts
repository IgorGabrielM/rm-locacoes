import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const isAuthRoute = req.url.includes('/auth/');
        const isUnauthorized = err.status === 401;

        if (!isAuthRoute && !isUnauthorized) {
          const mensagem =
            err.error?.message ||
            err.error?.error ||
            (typeof err.error === 'string' ? err.error : null) ||
            `Erro ${err.status}: ${err.statusText || 'Falha na requisição'}`;

          this.errorService.mostrar(mensagem);
        }

        return throwError(() => err);
      })
    );
  }
}