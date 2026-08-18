import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Investment, InvestmentRequest, PortfolioSummary } from '../models/investment.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private readonly api = inject(ApiService);

  list(): Observable<Investment[]> {
    return this.api.get<Investment[]>('/investments');
  }

  create(request: InvestmentRequest): Observable<Investment> {
    return this.api.post<Investment>('/investments', request);
  }

  update(id: string, request: InvestmentRequest): Observable<Investment> {
    return this.api.put<Investment>(`/investments/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/investments/${id}`);
  }

  summary(): Observable<PortfolioSummary> {
    return this.api.get<PortfolioSummary>('/investments/summary');
  }
}
