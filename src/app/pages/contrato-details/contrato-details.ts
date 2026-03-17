import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-contrato-details',
  standalone: false,
  templateUrl: './contrato-details.html',
  styleUrl: './contrato-details.scss',
})
export class ContratoDetails implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // Capturando os parâmetros
    const id = this.route.snapshot.queryParamMap.get('id');
    const deveAssinar = this.route.snapshot.queryParamMap.get('sign') === 'true';

    if (deveAssinar) {
      console.log('Abrir modo de assinatura para o ID:', id);
    }
  }
}
