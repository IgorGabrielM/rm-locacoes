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
  status: string;
  data_entrega: string;
  data_encerramento: string;
  equipamentos: Equipamento[];
  signature?: string;
  contrato_pai_id?: string;
  sub_contratos: Contrato[];
}

export interface ContratoCliente {
  nome?: string;
  cpf?: string;
  rg?: string;
  telefone?: string;
  email?: string;
}
