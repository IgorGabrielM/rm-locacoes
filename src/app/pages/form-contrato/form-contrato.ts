import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { ContratoService } from '../../services/contrato.service';
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../interfaces/equipamento';
import { BehaviorSubject } from 'rxjs';

interface ItemSelecionado {
  equipamento: Equipamento;
  quantidade: number;
}

@Component({
  selector: 'app-form-contrato',
  standalone: false,
  templateUrl: './form-contrato.html',
  styleUrl: './form-contrato.scss',
  providers: [ContratoService],
})
export class FormContrato implements OnInit {
  @ViewChild('equipAutoComplete') equipAutoComplete!: AutoComplete;

  contratoForm!: FormGroup;
  loading = false;
  responseOfContrato$ = new BehaviorSubject<any>(null);
  opcoesCidades = ['Indaituba', 'Salto', 'Itu'];
  opcoesCidadesFiltered = ['Indaituba', 'Salto', 'Itu'];

  catalogo: Equipamento[] = [];
  catalogoFiltered: Equipamento[] = [];
  itensSelecionados: ItemSelecionado[] = [];
  equipamentoInput: Equipamento | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contratoService: ContratoService,
    private equipamentoService: EquipamentoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.initForm();
    this.carregarCatalogo();
  }

  initForm() {
    this.contratoForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: [''],
      rg: [''],
      cidade: ['Indaiatuba', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', Validators.email],
      dataEntrega: [''],
      frete: [0],
    });
  }

  carregarCatalogo() {
    this.equipamentoService.listar().subscribe({
      next: (lista) => { this.catalogo = lista; this.cdr.detectChanges(); },
    });
  }

  filtrarCatalogo(event: any) {
    const query = event.query.toLowerCase();
    this.catalogoFiltered = this.catalogo.filter(e =>
      e.descricao.toLowerCase().includes(query)
    );
  }

  filtrarCidades(event: any) {
    const query = event.query;
    this.opcoesCidadesFiltered = this.opcoesCidades.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

  onEquipamentoSelecionado(equip: Equipamento) {
    const jaExiste = this.itensSelecionados.find(i => i.equipamento.id === equip.id);
    if (!jaExiste) {
      this.itensSelecionados = [...this.itensSelecionados, { equipamento: equip, quantidade: 1 }];
    }
    this.equipamentoInput = null;
    this.equipAutoComplete.inputEL.nativeElement.value = '';
    this.equipAutoComplete.inputEL.nativeElement.blur();
    this.cdr.detectChanges();
  }

  removerItem(index: number) {
    this.itensSelecionados = this.itensSelecionados.filter((_, i) => i !== index);
  }

  calcularSubtotal(item: ItemSelecionado): number {
    return item.equipamento.valor_padrao * item.quantidade;
  }

  calcularTotalEquipamentos(): number {
    return this.itensSelecionados.reduce((acc, item) => acc + this.calcularSubtotal(item), 0);
  }

  calcularFrete(): number {
    return Number(this.contratoForm.get('frete')?.value) || 0;
  }

  calcularTotalGeral(): number {
    return this.calcularTotalEquipamentos() + this.calcularFrete();
  }

  get formValido(): boolean {
    return this.contratoForm.valid && this.itensSelecionados.length > 0;
  }

  navigateBack() {
    this.router.navigate(['../']);
  }

  salvarContrato() {
    if (!this.formValido) return;
    this.loading = true;

    const payload = {
      ...this.contratoForm.value,
      equipamentos: this.itensSelecionados.map(i => ({
        equipamento_id: i.equipamento.id,
        quantidade: i.quantidade,
      })),
    };

    this.contratoService.salvar(payload).subscribe({
      next: (res) => {
        this.responseOfContrato$.next({
          status: '200',
          message: res.message,
          telefone: `55${res.telefone.replace(/\D/g, '')}`,
          id: res.id,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.responseOfContrato$.next({
          status: '500',
          message: err.error?.message || 'Erro ao salvar contrato',
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  fecharModal() {
    this.responseOfContrato$.next(null);
    this.navigateBack();
  }

  enviarContratoParaAssinatura(res: any) {
    const linkAssinatura = `https://rm-locacoes.vercel.app/contrato-details?id=${res.id}&sign=true`;
    const mensagem =
      `Olá ${this.contratoForm.get('nome')?.value}!\nSeu contrato de locação está pronto!\nAcesse esse link para assinar:\n${linkAssinatura}`;
    this.router.navigate(['../']);
    const url = `https://wa.me/${res.telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    this.loading = false;
  }
}
