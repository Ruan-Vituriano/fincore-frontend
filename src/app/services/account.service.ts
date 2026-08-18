import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Account, AccountRequest } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = inject(ApiService);

  list(): Observable<Account[]> {
    return this.api.get<Account[]>('/accounts');
  }

  create(request: AccountRequest): Observable<Account> {
    return this.api.post<Account>('/accounts', request);
  }

  update(id: string, request: AccountRequest): Observable<Account> {
    return this.api.put<Account>(`/accounts/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/accounts/${id}`);
  }
}
