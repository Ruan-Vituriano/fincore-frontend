import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);

  readonly title = input.required<string>();
  readonly toggleSidebar = output<void>();

  get userName(): string {
    return this.authService.currentUser()?.name ?? '';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
