import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions').then((m) => m.Transactions),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./pages/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./pages/budgets/budgets').then((m) => m.Budgets),
      },
      {
        path: 'goals',
        loadComponent: () =>
          import('./pages/goals/goals').then((m) => m.Goals),
      },
      {
        path: 'recurring-expenses',
        loadComponent: () =>
          import('./pages/recurring-expenses/recurring-expenses').then((m) => m.RecurringExpenses),
      },
      {
        path: 'investments',
        loadComponent: () =>
          import('./pages/investments/investments').then((m) => m.Investments),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
