import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly api = inject(ApiService);

  investmentAnalysis(): Observable<{ suggestion: string }> {
    return this.api.post<{ suggestion: string }>('/ai/investment-analysis', {});
  }
}
