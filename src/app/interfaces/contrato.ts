import {Equipamento} from './equipamento';

export interface Contrato {
  id?: string;
  nome: string;
  cpf: string;
  rg: string;
  cidade: string;
  endereco: string;
  bairro: string;
  telefone: string;
  email: string;
  dataLocacao: string;
  dataEntrega: string;
  equipamentos: Equipamento[];
}
