import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Contrato} from '../interfaces/contrato';
import {Observable} from 'rxjs';
import {IUSer} from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = 'https://backend-locacao.vercel.app/auth';

  constructor(private http: HttpClient) { }

  login(user: IUSer): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, user);
  }
}
