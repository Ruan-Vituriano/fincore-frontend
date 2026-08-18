import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecurringExpenseService } from '../../services/recurring-expense.service';
import { CategoryService } from '../../services/category.service';
import { AccountService } from '../../services/account.service';
import { RecurringExpense, RecurringExpenseRequest } from '../../models/recurring-expense.model';
import { Category } from '../../models/category.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-recurring-expenses',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './recurring-expenses.html',
  styleUrl: './recurring-expenses.css',
})
export class RecurringExpenses implements OnInit {
  private readonly recurringService = inject(RecurringExpenseService);
  private readonly categoryService = inject(CategoryService);
  private readonly accountService = inject(AccountService);

  expenses = signal<RecurringExpense[]>([]);
  categories = signal<Category[]>([]);
  accounts = signal<Account[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  generating = signal(false);
  error = signal('');
  successMessage = signal('');

  form: RecurringExpenseRequest = {
    description: '',
    amount: 0,
    categoryId: '',
    accountId: '',
    dayOfMonth: 1,
    isActive: true,
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadAccounts();
    this.load();
  }

  loadCategories(): void {
    this.categoryService.list().subscribe({ next: (data) => this.categories.set(data) });
  }

  loadAccounts(): void {
    this.accountService.list().subscribe({ next: (data) => this.accounts.set(data) });
  }

  load(): void {
    this.recurringService.list().subscribe({
      next: (data) => this.expenses.set(data),
      error: () => this.error.set('Erro ao carregar despesas recorrentes.'),
    });
  }

  openCreate(): void {
    this.form = { description: '', amount: 0, categoryId: '', accountId: '', dayOfMonth: 1, isActive: true };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(expense: RecurringExpense): void {
    this.form = {
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.categoryId,
      accountId: expense.accountId,
      dayOfMonth: expense.dayOfMonth,
      isActive: expense.isActive,
    };
    this.editingId.set(expense.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.description || !this.form.amount || !this.form.categoryId || !this.form.accountId) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.recurringService.update(id, this.form)
      : this.recurringService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Erro ao salvar.');
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    this.recurringService.delete(id).subscribe({ next: () => this.load() });
  }

  generate(): void {
    this.generating.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.recurringService.generate().subscribe({
      next: (response) => {
        this.generating.set(false);
        if (response.totalGenerated === 0) {
          this.successMessage.set('Todas as despesas recorrentes já foram geradas este mês.');
        } else {
          this.successMessage.set(`${response.totalGenerated} despesa(s) gerada(s) com sucesso!`);
        }
        this.load();
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err) => {
        this.generating.set(false);
        this.error.set(err.error?.detail ?? 'Erro ao gerar despesas.');
      },
    });
  }
}
