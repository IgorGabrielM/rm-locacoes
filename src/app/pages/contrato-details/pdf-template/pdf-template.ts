import { Component, ElementRef, Input } from '@angular/core';
import { Contrato } from '../../../interfaces/contrato';

@Component({
  selector: 'app-pdf-template',
  standalone: false,
  templateUrl: './pdf-template.html',
  styleUrl: './pdf-template.scss',
})
export class PdfTemplate {
  @Input() contrato!: Contrato;
  @Input() hoje!: Date;

  constructor(public elementRef: ElementRef) {}

  calcularMeses(): number {
    if (!this.contrato?.data_entrega || !this.contrato?.data_encerramento) return 1;
    const start = new Date(this.contrato.data_entrega);
    const end = new Date(this.contrato.data_encerramento);
    const meses = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(1, meses);
  }

  calcularTotal(): number {
    if (!this.contrato?.equipamentos) return 0;
    const meses = this.calcularMeses();
    return this.contrato.equipamentos.reduce((total, equip) => {
      return total + ((equip.valor || 0) * (equip.quantidade || 0) * meses);
    }, 0);
  }
}
