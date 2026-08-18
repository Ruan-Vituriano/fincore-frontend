import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = signal('');
  loading = signal(false);

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error.set('Preencha todos os campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não conferem.');
      return;
    }

    if (this.password.length < 8) {
      this.error.set('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Erro ao criar conta.');
      },
    });
  }
}
