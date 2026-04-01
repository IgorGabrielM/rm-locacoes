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
  data_locacao: string;
  data_entrega: string;
  data_encerramento: string;
  equipamentos: Equipamento[];
  signature?: string;
}
