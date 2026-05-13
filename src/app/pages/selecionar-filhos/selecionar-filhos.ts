import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoService } from '../../services/contrato.service';
import { Contrato } from '../../interfaces/contrato';

@Component({
  selector: 'app-selecionar-filhos',
  standalone: false,
  templateUrl: './selecionar-filhos.html',
})
export class SelecionarFilhos implements OnInit {
  paiId = '';
  contratoPai: Contrato | null = null;
  contratos: Contrato[] = [];
  selectedIds = new Set<string>();
  loading = true;
  vinculando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratoService: ContratoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.paiId = this.route.snapshot.queryParamMap.get('paiId') ?? '';
    if (!this.paiId) { this.router.navigate(['/home']); return; }

    this.contratoService.buscarPorId(this.paiId).subscribe(pai => {
      this.contratoPai = pai;
      this.contratoService.listarTodos().subscribe(todos => {
        this.contratos = todos.filter(c =>
          c.id !== this.paiId &&
          !c.contrato_pai_id &&
          (
            (c.nome && pai.nome && c.nome.toLowerCase() === pai.nome.toLowerCase()) ||
            (c.cpf && pai.cpf && c.cpf === pai.cpf) ||
            (c.rg && pai.rg && c.rg === pai.rg) ||
            (c.telefone && pai.telefone && c.telefone === pai.telefone)
          )
        );
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  toggle(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  confirmar() {
    if (this.selectedIds.size === 0 || this.vinculando) return;
    this.vinculando = true;
    this.contratoService.vincularFilhos([...this.selectedIds], this.paiId).subscribe({
      next: () => {
        this.router.navigate(['/contrato-details'], { queryParams: { id: this.paiId } });
      },
      error: (err) => {
        this.vinculando = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/contrato-details'], { queryParams: { id: this.paiId } });
  }
}
