import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Budget, BudgetRequest, BudgetSummary } from '../models/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly api = inject(ApiService);

  list(month?: number, year?: number): Observable<Budget[]> {
    return this.api.get<Budget[]>('/budgets', { month, year });
  }

  create(request: BudgetRequest): Observable<Budget> {
    return this.api.post<Budget>('/budgets', request);
  }

  update(id: string, request: BudgetRequest): Observable<Budget> {
    return this.api.put<Budget>(`/budgets/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/budgets/${id}`);
  }

  summary(month: number, year: number): Observable<BudgetSummary[]> {
    return this.api.get<BudgetSummary[]>('/budgets/summary', { month, year });
  }
}
