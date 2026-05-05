import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratoService} from '../../services/contrato.service';
import {Contrato} from '../../interfaces/contrato';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-contrato-details',
  standalone: false,
  templateUrl: './contrato-details.html',
  styleUrl: './contrato-details.scss',
})
export class ContratoDetails implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfTemplate') pdfTemplate!: ElementRef;

  signaturePad!: SignaturePad;
  contrato: Contrato;
  loading = true;
  deveAssinar = false;
  gerandoPDF = false;
  hoje = new Date();

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

    const el = this.pdfTemplate.nativeElement;
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
    this.contratoService.assinarDocumento(this.contrato.id, base64).subscribe({
      next: () => {
        alert('Contrato assinado com sucesso!');
        this.router.navigate(['/sucesso']);
      },
      error: (err) => console.error('Erro ao assinar', err)
    });
  }

  calcularTotal(): number {
    if (!this.contrato?.equipamentos) return 0;
    return this.contrato.equipamentos.reduce((total, equip) => {
      return total + ((equip.valor || 0) * (equip.quantidade || 0));
    }, 0);
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
