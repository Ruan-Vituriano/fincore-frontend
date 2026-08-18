import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Account, AccountRequest, AccountType } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  private readonly accountService = inject(AccountService);

  accounts = signal<Account[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  form: AccountRequest = { name: '', type: 'CHECKING', balance: 0 };
  readonly types: AccountType[] = ['CHECKING', 'SAVINGS', 'CREDIT_CARD'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.accountService.list().subscribe({
      next: (data) => this.accounts.set(data),
      error: () => this.error.set('Erro ao carregar contas.'),
    });
  }

  openCreate(): void {
    this.form = { name: '', type: 'CHECKING', balance: 0 };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(account: Account): void {
    this.form = { name: account.name, type: account.type, balance: account.balance };
    this.editingId.set(account.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.name) {
      this.error.set('Nome é obrigatório.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.accountService.update(id, this.form)
      : this.accountService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
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
    this.accountService.delete(id).subscribe({ next: () => this.load() });
  }

  typeLabel(type: AccountType): string {
    const labels: Record<AccountType, string> = {
      CHECKING: 'Corrente',
      SAVINGS: 'Poupança',
      CREDIT_CARD: 'Cartão de Crédito',
    };
    return labels[type];
  }
}
