import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RecurringExpense, RecurringExpenseRequest, GenerateResponse } from '../models/recurring-expense.model';

@Injectable({ providedIn: 'root' })
export class RecurringExpenseService {
  private readonly api = inject(ApiService);

  list(): Observable<RecurringExpense[]> {
    return this.api.get<RecurringExpense[]>('/recurring-expenses');
  }

  create(request: RecurringExpenseRequest): Observable<RecurringExpense> {
    return this.api.post<RecurringExpense>('/recurring-expenses', request);
  }

  update(id: string, request: RecurringExpenseRequest): Observable<RecurringExpense> {
    return this.api.put<RecurringExpense>(`/recurring-expenses/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/recurring-expenses/${id}`);
  }

  generate(): Observable<GenerateResponse> {
    return this.api.post<GenerateResponse>('/recurring-expenses/generate', {});
  }
}
