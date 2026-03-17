import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ContratoService} from '../../services/contrato';
import {ConfirmationService} from 'primeng/api';

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
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      cidade: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataLocacao: ['', Validators.required],
      dataEntrega: ['', Validators.required],
      equipamentos: this.fb.array([this.criarEquipamento()])
    });
  }

  navigateBack(){
    this.router.navigate(['../']);
  }

  // Helper para criar o grupo de cada equipamento
  criarEquipamento(): FormGroup {
    return this.fb.group({
      descricao: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valor: [0, Validators.required]
    });
  }

  // Getters para facilitar o acesso no HTML
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
    if (this.contratoForm.valid) {
      this.loading = true;
      console.log('Dados do Contrato:', this.contratoForm.value);
      this.contratoService.salvar(this.contratoForm.value).subscribe((res) => {
        console.log('res', res)
        this.loading = false;
        this.confirmationService.confirm({
          message: 'Deseja enviar o contrato?',
          header: 'Assinar',
          acceptLabel: 'Sim',
          rejectLabel: 'Não',
          accept: () => {
            const telefoneLimpo = res.telefone.replace(/\D/g, '');
            const numeroCompleto = '55' + telefoneLimpo;
            const linkAssinatura = `http://localhost:4200/contrato-details?id=${res.id}&sign=true`;
            const mensagem =
              `Olá ${this.contratoForm.get('nome')?.value}!
Seu contrato de locação para o dia ${this.contratoForm.get('dataLocacao')?.value} está pronto!
Acesse esse link para assinar:
${linkAssinatura}
          `;
            const mensagemUrl = encodeURIComponent(mensagem);
            const url = `https://wa.me/${numeroCompleto}?text=${mensagemUrl}`;
            window.open(url, '_blank');
            console.log('Contrato salvo com sucesso!');
            this.loading = false;
          },
          reject: () => {
            this.loading = false;
            console.log('Ação cancelada pelo usuário');
          }
        })
      })
    } else {
      console.error('Formulário inválido');
    }
  }
}
