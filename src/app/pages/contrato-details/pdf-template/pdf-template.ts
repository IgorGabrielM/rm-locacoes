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

  calcularTotal(): number {
    if (!this.contrato?.equipamentos) return 0;
    return this.contrato.equipamentos.reduce((total, equip) => {
      return total + ((equip.valor || 0) * (equip.quantidade || 0));
    }, 0);
  }
}
