import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-contrato',
  standalone: false,
  templateUrl: './form-contrato.html',
  styleUrl: './form-contrato.scss',
})
export class FormContrato implements OnInit {
  contratoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      console.log('Dados do Contrato:', this.contratoForm.value);
      // Aqui você chamará seu serviço do NestJS futuramente
      // this.router.navigate(['/assinatura', idGerado]);
    } else {
      console.error('Formulário inválido');
    }
  }
}
