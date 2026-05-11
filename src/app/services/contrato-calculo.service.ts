import { Injectable } from '@angular/core';
import { Contrato } from '../interfaces/contrato';

@Injectable({ providedIn: 'root' })
export class ContratoCalculoService {

  calcularDias(contrato: Contrato): number {
    if (!contrato?.data_entrega) return 0;
    const start = new Date(contrato.data_entrega);
    const end = contrato.data_encerramento
      ? new Date(contrato.data_encerramento)
      : new Date();
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }

  calcularCoeficiente(contrato: Contrato): number {
    const dias = this.calcularDias(contrato);
    return Math.max(1, dias / 30);
  }

  calcularPeriodoLabel(contrato: Contrato): string {
    const dias = this.calcularDias(contrato);
    const meses = Math.floor(dias / 30);
    const diasExtras = dias % 30;
    if (meses === 0) return diasExtras === 1 ? '1 dia' : `${diasExtras} dias`;
    const parteM = meses === 1 ? '1 mês' : `${meses} meses`;
    if (diasExtras === 0) return parteM;
    return `${parteM} e ${diasExtras === 1 ? '1 dia' : `${diasExtras} dias`}`;
  }

  calcularTotal(contrato: Contrato): number {
    if (!contrato?.equipamentos?.length) return 0;
    const coef = this.calcularCoeficiente(contrato);
    return contrato.equipamentos.reduce((total, equip) => {
      return total + ((equip.valor_cobrado || equip.valor_padrao || 0) * (equip.quantidade || 0) * coef);
    }, 0);
  }
}
