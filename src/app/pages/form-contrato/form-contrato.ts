import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ContratoService} from '../../services/contrato.service';
import {ConfirmationService} from 'primeng/api';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-form-contrato',
  standalone: false,
  templateUrl: './form-contrato.html',
  styleUrl: './form-contrato.scss',
  providers: [ContratoService, ConfirmationService]
})
export class FormContrato implements OnInit {
  contratoForm!: FormGroup;
  loading = false;
  responseOfContrato$ = new BehaviorSubject<any>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contratoService: ContratoService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.contratoForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: [''],
      rg: [''],
      cidade: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', Validators.email],
      dataEntrega: [''],
      equipamentos: this.fb.array([this.criarEquipamento()])
    });
  }

  navigateBack() {
    this.router.navigate(['../']);
  }

  criarEquipamento(): FormGroup {
    return this.fb.group({
      descricao: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valor: [0, Validators.required]
    });
  }

  get equipamentos() {
    return this.contratoForm.get('equipamentos') as FormArray;
  }

  addEquipamento() {
    this.equipamentos.push(this.criarEquipamento());
  }

  removerEquipamento(index: number) {
    this.equipamentos.removeAt(index);
  }

  salvarContrato() {
    this.loading = true;

    this.contratoService.salvar(this.contratoForm.value).subscribe({
      next: (res) => {
        const novoEstado = {
          status: '200',
          message: res.message,
          telefone: `55${res.telefone.replace(/\D/g, '')}`,
          id: res.id,
        };

        this.responseOfContrato$.next(novoEstado); // Notifica o HTML
        this.loading = false;
      },
      error: (err) => {
        this.responseOfContrato$.next({
          status: '500',
          message: err.error?.message || 'Erro ao salvar contrato',
        });
        this.loading = false;
      }
    });
  }

  fecharModal() {
    this.responseOfContrato$.next(null);
    this.navigateBack();
  }

  enviarContratoParaAssinatura(res: any) {
    const linkAssinatura = `https://rm-locacoes.vercel.app/contrato-details?id=${res.id}&sign=true`;
    const mensagem =
      `Olá ${this.contratoForm.get('nome')?.value}!
Seu contrato de locação para o dia ${this.contratoForm.get('dataLocacao')?.value} está pronto!
Acesse esse link para assinar:
${linkAssinatura}
          `;
    this.router.navigate(['../']);
    const mensagemUrl = encodeURIComponent(mensagem);
    const url = `https://wa.me/${res.telefone}?text=${mensagemUrl}`;
    window.open(url, '_blank');
    this.loading = false;
  }
}
