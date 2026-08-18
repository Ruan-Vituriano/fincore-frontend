import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { AccountService } from '../../services/account.service';
import { Transaction, TransactionRequest, TransactionFilters, TransactionType } from '../../models/transaction.model';
import { Category } from '../../models/category.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);
  private readonly accountService = inject(AccountService);

  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  accounts = signal<Account[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  filters: TransactionFilters = {};
  form: TransactionRequest = { description: '', amount: 0, date: '', categoryId: '', accountId: '' };
  readonly types: TransactionType[] = ['INCOME', 'EXPENSE'];

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
    this.transactionService.list(this.filters).subscribe({
      next: (data) => this.transactions.set(data),
      error: () => this.error.set('Erro ao carregar transações.'),
    });
  }

  applyFilters(): void {
    this.load();
  }

  clearFilters(): void {
    this.filters = {};
    this.load();
  }

  openCreate(): void {
    this.form = { description: '', amount: 0, date: new Date().toISOString().split('T')[0], categoryId: '', accountId: '' };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(tx: Transaction): void {
    this.form = {
      description: tx.description,
      amount: tx.amount,
      date: tx.date,
      categoryId: tx.categoryId,
      accountId: tx.accountId,
      notes: tx.notes,
      isRecurring: tx.isRecurring,
      totalInstallments: tx.totalInstallments,
    };
    this.editingId.set(tx.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.description || !this.form.amount || !this.form.date || !this.form.categoryId || !this.form.accountId) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();

    if (id) {
      this.transactionService.update(id, this.form).subscribe({
        next: () => {
          this.showModal.set(false);
          this.load();
          this.loading.set(false);
        },
        error: (err: { error?: { detail?: string } }) => {
          this.loading.set(false);
          this.error.set(err.error?.detail ?? 'Erro ao salvar.');
        },
      });
    } else {
      this.transactionService.create(this.form).subscribe({
        next: () => {
          this.showModal.set(false);
          this.load();
          this.loading.set(false);
        },
        error: (err: { error?: { detail?: string } }) => {
          this.loading.set(false);
          this.error.set(err.error?.detail ?? 'Erro ao salvar.');
        },
      });
    }
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    this.transactionService.delete(id).subscribe({ next: () => this.load() });
  }

  typeLabel(type: TransactionType): string {
    return type === 'INCOME' ? 'Receita' : 'Despesa';
  }
}
