import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratoService} from '../../services/contrato';
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
  @ViewChild('conteudo', { static: false }) conteudo!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  signaturePad!: SignaturePad;
  contrato: Contrato;
  loading: boolean = true;
  deveAssinar: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getPrams();
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'rgb(0, 0, 0)'
    });
  }

  getPrams(){
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id){
      this.getContrato(id);
    }
    this.deveAssinar = this.route.snapshot.queryParamMap.get('sign') === 'true';

    if (this.deveAssinar) {
      console.log('Abrir modo de assinatura para o ID:', id);
    }
  }

  getContrato(id: string){
    this.contratoService.buscarPorId(id).subscribe((contrato: Contrato) => {
      this.contrato = contrato;
      this.loading = false;
      this.cdr.detectChanges();
      console.log(contrato);
    })
  }


  exportarPDF() {
    const data = this.conteudo.nativeElement;

    html2canvas(data, { scale: 2 }).then((canvas) => {
      const imgWidth = 208; // Largura A4 em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('contrato_locacao.pdf');
    });
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
}
