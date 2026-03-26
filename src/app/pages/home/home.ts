import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ContratoService} from '../../services/contrato';
import {Contrato} from '../../interfaces/contrato';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  contratos: Contrato[] = [];

  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.listarContratos();
  }

  listarContratos() {
    this.contratoService.listarTodos().subscribe((contratos) => {
      console.log(contratos);
      this.contratos = contratos;
      this.cdr.detectChanges();
    })
  }

  criarContrato() {
    this.router.navigate(['/form-contrato']);
  }

  getValorTotal(contrato: Contrato) {
    return contrato.equipamentos.reduce((acc: number, curr: any) => {
      const qtd = curr.quantidade || 0;
      const valor = curr.valor || 0;
      return acc + (qtd * valor);
    }, 0);
  }

  navegarContratoDetalhes(contrato: Contrato) {
    this.router.navigate(['/contrato-details'],
      {
        queryParams: {id: contrato.id}
      }
    );
  }
}
