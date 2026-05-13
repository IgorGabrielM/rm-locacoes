import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratoService} from '../../services/contrato.service';
import {ContratoCalculoService} from '../../services/contrato-calculo.service';
import {Contrato} from '../../interfaces/contrato';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import {PdfTemplate} from './pdf-template/pdf-template';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-contrato-details',
  standalone: false,
  templateUrl: './contrato-details.html',
  styleUrl: './contrato-details.scss',
})
export class ContratoDetails implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(PdfTemplate) pdfTemplate!: PdfTemplate;

  signaturePad!: SignaturePad;
  contrato: Contrato;
  loading = true;
  deveAssinar = false;
  gerandoPDF = false;
  encerrando = false;
  hoje = new Date();
  showSuccessModal = false;
  showEncerrarModal = false;
  dataEncerramento: Date = new Date();
  editandoCliente = false;
  salvandoCliente = false;
  clienteForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private calculo: ContratoCalculoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.getPrams();
  }

  ngAfterViewInit() {
    if (this.deveAssinar) {
      this.signaturePad = new SignaturePad(this.canvas.nativeElement, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
      });
    }
  }

  getPrams() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.getContrato(id);
    }
    this.deveAssinar = this.route.snapshot.queryParamMap.get('sign') === 'true';
  }

  getContrato(id: string) {
    this.contratoService.buscarPorId(id).subscribe((contrato: Contrato) => {
      this.contrato = contrato;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  async exportarPDF() {
    if (!this.contrato || this.gerandoPDF) return;

    this.gerandoPDF = true;
    this.hoje = new Date();
    this.cdr.detectChanges();

    await new Promise(r => setTimeout(r, 300));

    const el = this.pdfTemplate.elementRef.nativeElement;
    const canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = 210;
    const pdfH = 297;
    const ratio = pdfW / canvas.width;
    const scaledH = canvas.height * ratio;

    if (scaledH <= pdfH) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, scaledH);
    } else {
      const pageHeightPx = Math.floor(pdfH / ratio);
      let y = 0;
      let page = 0;
      while (y < canvas.height) {
        const sliceH = Math.min(pageHeightPx, canvas.height - y);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceH;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        if (page > 0) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceH * ratio);
        y += sliceH;
        page++;
      }
    }

    const nomeArquivo = this.contrato.nome.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`contrato_${nomeArquivo}.pdf`);

    this.gerandoPDF = false;
    this.cdr.detectChanges();
  }

  limparAssinatura() {
    this.signaturePad.clear();
  }

  salvarAssinatura() {
    if (this.signaturePad.isEmpty()) {
      alert('Por favor, assine antes de confirmar.');
      return;
    }
    const base64 = this.signaturePad.toDataURL('image/png');
    this.contratoService.assinarContrato(this.contrato.id!, base64).subscribe({
      next: () => {
        this.contrato.signature = base64;
        this.contrato.status = 'Em andamento';
        this.deveAssinar = false;
        this.cdr.detectChanges();
        this.showSuccessModal = true;
        this.exportarPDF();
      },
    });
  }

  fecharModalSucesso() {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

  calcularPeriodoLabel(): string { return this.calculo.calcularPeriodoLabel(this.contrato); }
  calcularTotal(): number { return this.calculo.calcularTotal(this.contrato); }

  calcularPeriodoLabelFilho(filho: Contrato): string { return this.calculo.calcularPeriodoLabel(filho); }
  calcularTotalFilho(filho: Contrato): number { return this.calculo.calcularTotal(filho); }

  calcularTotalGeral(): number { return this.calculo.calcularTotalGeral(this.contrato); }

  temSubContratos(): boolean { return (this.contrato?.sub_contratos?.length || 0) > 0; }

  abrirModalEncerrar() {
    this.dataEncerramento = new Date();
    this.showEncerrarModal = true;
  }

  fecharModalEncerrar() {
    this.showEncerrarModal = false;
  }

  confirmarEncerramento() {
    if (!this.contrato?.id || this.encerrando) return;
    this.encerrando = true;
    this.showEncerrarModal = false;
    const iso = this.dataEncerramento.toISOString().split('T')[0];
    this.contratoService.finalizarContrato(this.contrato.id, iso).subscribe({
      next: () => {
        this.getContrato(this.contrato.id!);
        this.encerrando = false;
      },
      error: (err) => {
        this.encerrando = false;
      }
    });
  }

  abrirEdicaoCliente() {
    this.clienteForm = this.fb.group({
      nome: [this.contrato.nome],
      cpf: [this.contrato.cpf],
      rg: [this.contrato.rg],
      telefone: [this.contrato.telefone],
      email: [this.contrato.email],
    });
    this.editandoCliente = true;
  }

  cancelarEdicaoCliente() {
    this.editandoCliente = false;
  }

  salvarCliente() {
    if (this.salvandoCliente) return;
    this.salvandoCliente = true;
    this.contratoService.editarCliente(this.contrato.id!, this.clienteForm.value).subscribe({
      next: () => {
        Object.assign(this.contrato, this.clienteForm.value);
        this.editandoCliente = false;
        this.salvandoCliente = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.salvandoCliente = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  navegarParaSelecionarFilhos() {
    this.router.navigate(['/selecionar-filhos'], { queryParams: { paiId: this.contrato.id } });
  }
}
