import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ContratoService} from '../../services/contrato.service';
import {Contrato} from '../../interfaces/contrato';
import {ContratoCalculoService} from '../../services/contrato-calculo.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  contratos: Contrato[] = [];
  loading: boolean = true;
  termoBusca = '';

  get contratosFiltrados(): Contrato[] {
    const termo = this.termoBusca.trim().toLowerCase();
    const lista = this.contratos.slice().reverse();
    const filtrada = termo
      ? lista.filter(c =>
          [c.id, c.nome, c.cpf, c.rg, c.endereco, c.bairro, c.telefone, c.email, c.status]
            .some(v => v?.toLowerCase().includes(termo))
        )
      : lista;
    return filtrada.sort((a, b) => {
      const aEnc = a.status === 'Encerrado' ? 1 : 0;
      const bEnc = b.status === 'Encerrado' ? 1 : 0;
      return aEnc - bEnc;
    });
  }

  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private calculo: ContratoCalculoService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.listarContratos();
  }

  listarContratos() {
    this.contratoService.listarTodos().subscribe((contratos) => {
      this.contratos = contratos;
      this.loading = false;
      this.cdr.detectChanges();
    })
  }

  criarContrato() {
    this.router.navigate(['/form-contrato']);
  }

  calcularTotalGeral(contrato: Contrato): number {
    return this.calculo.calcularTotalGeral(contrato); }

  getValorTotal(contrato: Contrato) {
    return contrato.equipamentos?.reduce((acc: number, curr: any) => {
      const qtd = curr.quantidade || 0;
      const valor = curr.valor_cobrado || 0;
      return acc + (qtd * valor);
    }, 0);
  }

  irParaCatalogo() {
    this.router.navigate(['/catalogo-equipamentos']);
  }

  navegarContratoDetalhes(contrato: Contrato) {
    this.router.navigate(['/contrato-details'],
      {
        queryParams: {id: contrato.id}
      }
    );
  }
}
