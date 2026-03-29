import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Contrato} from '../interfaces/contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private readonly API = 'https://backend-locacao.vercel.app/contratos';

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

  assinarDocumento(id: string, signatureBase64: string): Observable<any> {
    return this.http.patch(`${this.API}/${id}/signature`, {
      signature: signatureBase64
    });
  }
}
