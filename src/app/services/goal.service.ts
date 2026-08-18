import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FinancialGoal, GoalRequest, GoalProgress } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly api = inject(ApiService);

  list(): Observable<FinancialGoal[]> {
    return this.api.get<FinancialGoal[]>('/goals');
  }

  create(request: GoalRequest): Observable<FinancialGoal> {
    return this.api.post<FinancialGoal>('/goals', request);
  }

  update(id: string, request: GoalRequest): Observable<FinancialGoal> {
    return this.api.put<FinancialGoal>(`/goals/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/goals/${id}`);
  }

  progress(id: string): Observable<GoalProgress> {
    return this.api.get<GoalProgress>(`/goals/${id}/progress`);
  }
}
