import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Transaction, TransactionRequest, TransactionFilters } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = inject(ApiService);

  list(filters?: TransactionFilters): Observable<Transaction[]> {
    return this.api.get<Transaction[]>('/transactions', filters as Record<string, string | number | boolean | undefined>);
  }

  create(request: TransactionRequest): Observable<Transaction[]> {
    return this.api.post<Transaction[]>('/transactions', request);
  }

  update(id: string, request: TransactionRequest, applyToAll: boolean = false): Observable<Transaction> {
    return this.api.put<Transaction>(`/transactions/${id}`, request, { applyToAll });
  }

  delete(id: string, applyToAll: boolean = false): Observable<void> {
    return this.api.delete<void>(`/transactions/${id}`, { applyToAll });
  }

  listInstallments(parentId: string): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(`/transactions/installments/${parentId}`);
  }
}
