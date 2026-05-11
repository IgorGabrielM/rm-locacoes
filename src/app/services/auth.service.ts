import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IUSer } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  login(user: IUSer): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, user).pipe(
      tap(res => {
        const token = res?.session?.access_token;
        if (token) {
          localStorage.setItem(this.TOKEN_KEY, token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
