import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratoService} from '../../services/contrato.service';
import {Contrato} from '../../interfaces/contrato';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import {PdfTemplate} from './pdf-template/pdf-template';

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

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
      error: (err) => console.error('Erro ao assinar', err)
    });
  }

  fecharModalSucesso() {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

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

  encerrarContrato() {
    if (!this.contrato?.id || this.encerrando) return;
    this.encerrando = true;
    this.contratoService.finalizarContrato(this.contrato.id).subscribe({
      next: () => {
        this.getContrato(this.contrato.id!);
        this.encerrando = false;
      },
      error: (err) => {
        console.error('Erro ao encerrar contrato', err);
        this.encerrando = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
