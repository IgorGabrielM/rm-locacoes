import { Component, ElementRef, Input } from '@angular/core';
import { ContratoCalculoService } from '../../../services/contrato-calculo.service';
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

  constructor(public elementRef: ElementRef, private calculo: ContratoCalculoService) {}

  calcularPeriodoLabel(): string { return this.calculo.calcularPeriodoLabel(this.contrato); }
  calcularTotal(): number { return this.calculo.calcularTotal(this.contrato); }
}
