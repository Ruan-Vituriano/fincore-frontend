import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'fincore_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<User | null>(null);

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly currentUser = this.userSignal.asReadonly();

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.api.post<TokenResponse>('/auth/login', request).pipe(
      tap((response) => {
        this.setToken(response.accessToken);
        this.loadUser();
      }),
    );
  }

  register(request: RegisterRequest): Observable<TokenResponse> {
    return this.api.post<TokenResponse>('/auth/register', request).pipe(
      tap((response) => {
        this.setToken(response.accessToken);
        this.loadUser();
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  loadUser(): void {
    this.api.get<User>('/users/me').subscribe({
      next: (user) => this.userSignal.set(user),
      error: () => this.logout(),
    });
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }
}
