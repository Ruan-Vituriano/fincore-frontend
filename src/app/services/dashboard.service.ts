import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardSummary, ExpensesByCategory, MonthlyEvolution } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);

  getSummary(month: number, year: number): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('/dashboard/summary', { month, year });
  }

  getExpensesByCategory(month: number, year: number): Observable<ExpensesByCategory[]> {
    return this.api.get<ExpensesByCategory[]>('/dashboard/expenses-by-category', { month, year });
  }

  getMonthlyEvolution(months: number = 12): Observable<MonthlyEvolution[]> {
    return this.api.get<MonthlyEvolution[]>('/dashboard/monthly-evolution', { months });
  }
}
