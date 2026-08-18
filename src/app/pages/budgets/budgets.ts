import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { CategoryService } from '../../services/category.service';
import { Budget, BudgetRequest, BudgetSummary } from '../../models/budget.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-budgets',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets implements OnInit {
  private readonly budgetService = inject(BudgetService);
  private readonly categoryService = inject(CategoryService);

  budgets = signal<Budget[]>([]);
  categories = signal<Category[]>([]);
  summary = signal<BudgetSummary[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  filterMonth = new Date().getMonth() + 1;
  filterYear = new Date().getFullYear();

  form: BudgetRequest = { name: '', amount: 0, categoryId: '', month: 1, year: new Date().getFullYear() };

  readonly months = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.load();
    this.loadSummary();
  }

  loadCategories(): void {
    this.categoryService.list().subscribe({ next: (data) => this.categories.set(data) });
  }

  load(): void {
    this.budgetService.list(this.filterMonth, this.filterYear).subscribe({
      next: (data) => this.budgets.set(data),
      error: () => this.error.set('Erro ao carregar orçamentos.'),
    });
  }

  loadSummary(): void {
    this.budgetService.summary(this.filterMonth, this.filterYear).subscribe({
      next: (data) => this.summary.set(data),
      error: () => this.error.set('Erro ao carregar resumo de orçamentos.'),
    });
  }

  applyFilter(): void {
    this.load();
    this.loadSummary();
  }

  openCreate(): void {
    this.form = { name: '', amount: 0, categoryId: '', month: this.filterMonth, year: this.filterYear };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(budget: Budget): void {
    this.form = { name: budget.name, amount: budget.amount, categoryId: budget.categoryId, month: budget.month, year: budget.year };
    this.editingId.set(budget.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.name || !this.form.amount || !this.form.categoryId) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.budgetService.update(id, this.form)
      : this.budgetService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
        this.loadSummary();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Erro ao salvar.');
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    this.budgetService.delete(id).subscribe({ next: () => { this.load(); this.loadSummary(); } });
  }
}
