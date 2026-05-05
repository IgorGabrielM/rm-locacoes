import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IUSer } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = 'https://backend-locacao.vercel.app/auth';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  login(user: IUSer): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, user).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, JSON.stringify(res)))
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
