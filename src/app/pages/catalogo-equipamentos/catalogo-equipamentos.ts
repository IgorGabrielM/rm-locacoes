import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../interfaces/equipamento';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-catalogo-equipamentos',
  standalone: false,
  templateUrl: './catalogo-equipamentos.html',
  styleUrl: './catalogo-equipamentos.scss',
})
export class CatalogoEquipamentos implements OnInit {
  equipamentos: Equipamento[] = [];
  loading = true;
  salvando = false;
  excluindo: string | null = null;

  showModal = false;
  modoEdicao = false;
  idEmEdicao: string | null = null;
  form!: FormGroup;

  showConfirmExcluir = false;
  idParaExcluir: string | null = null;

  constructor(
    private equipamentoService: EquipamentoService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadEquipamentos();
  }

  initForm() {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      valor_padrao: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  loadEquipamentos() {
    this.loading = true;
    this.equipamentoService.listar().pipe(
    ).subscribe({
      next: (lista) => {
        console.log(lista)
        this.loading = false
        this.equipamentos = lista;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalCriar() {
    this.modoEdicao = false;
    this.idEmEdicao = null;
    this.form.reset({ descricao: '', valor_padrao: null });
    this.showModal = true;
  }

  abrirModalEditar(equip: Equipamento) {
    this.modoEdicao = true;
    this.idEmEdicao = equip.id!;
    this.form.patchValue({ descricao: equip.descricao, valor_padrao: equip.valor_padrao });
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
  }

  salvar() {
    if (this.form.invalid || this.salvando) return;
    this.salvando = true;
    const payload = this.form.value;

    const op$ = this.modoEdicao
      ? this.equipamentoService.atualizar(this.idEmEdicao!, payload)
      : this.equipamentoService.criar(payload);

    op$.subscribe({
      next: () => {
        this.salvando = false;
        this.showModal = false;
        this.cdr.detectChanges();
        this.loadEquipamentos();
      },
      error: () => { this.salvando = false; this.cdr.detectChanges(); }
    });
  }

  confirmarExcluir(id: string) {
    this.idParaExcluir = id;
    this.showConfirmExcluir = true;
  }

  cancelarExcluir() {
    this.idParaExcluir = null;
    this.showConfirmExcluir = false;
  }

  excluir() {
    if (!this.idParaExcluir) return;
    this.excluindo = this.idParaExcluir;
    this.showConfirmExcluir = false;
    this.equipamentoService.excluir(this.idParaExcluir).subscribe({
      next: () => {
        this.excluindo = null;
        this.idParaExcluir = null;
        this.cdr.detectChanges();
        this.loadEquipamentos();
      },
      error: () => {
        this.excluindo = null;
        this.idParaExcluir = null;
        this.cdr.detectChanges();
      }
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
