import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../interfaces/equipamento';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  private readonly API = `${environment.apiUrl}/equipamentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(this.API);
  }

  criar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(this.API, equipamento);
  }

  atualizar(id: string, equipamento: Equipamento): Observable<Equipamento> {
    return this.http.patch<Equipamento>(`${this.API}/${id}`, equipamento);
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
