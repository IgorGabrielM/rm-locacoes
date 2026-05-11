export interface Equipamento {
  id?: string;
  descricao: string;
  valor_padrao: number;
  valor_cobrado?: number;
  quantidade?: number; // populado pelo join com a pivot table
}
