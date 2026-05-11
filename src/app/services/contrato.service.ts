import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Contrato} from '../interfaces/contrato';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private readonly API = `${environment.apiUrl}/contratos`;

  constructor(private http: HttpClient) { }

  salvar(contrato: Contrato): Observable<any> {
    return this.http.post<any>(this.API, contrato);
  }

  listarTodos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.API);
  }

  buscarPorId(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.API}/${id}`);
  }

  assinarContrato(id: string, signatureBase64: string): Observable<any> {
    return this.http.patch(`${this.API}/${id}/signature`, {
      signature: signatureBase64
    });
  }

  finalizarContrato(id: string, dataEncerramento: string): Observable<any> {
    return this.http.post(`${this.API}/${id}/closure`, { dataEncerramento: dataEncerramento });
  }
}
