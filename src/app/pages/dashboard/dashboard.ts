import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { InvestmentService } from '../../services/investment.service';
import { SummaryCards } from '../../components/summary-cards/summary-cards';
import { ExpensesByCategoryChart } from '../../components/expenses-by-category-chart/expenses-by-category-chart';
import { MonthlyEvolutionChart } from '../../components/monthly-evolution-chart/monthly-evolution-chart';
import { SavingsRateCard } from '../../components/savings-rate-card/savings-rate-card';
import { BalanceEvolutionChart } from '../../components/balance-evolution-chart/balance-evolution-chart';
import { InvestmentSummaryCard } from '../../components/investment-summary-card/investment-summary-card';
import { DashboardSummary, ExpensesByCategory, MonthlyEvolution, SavingsRate, BalanceEvolution } from '../../models/dashboard.model';
import { PortfolioSummary } from '../../models/investment.model';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, SummaryCards, ExpensesByCategoryChart, MonthlyEvolutionChart, SavingsRateCard, BalanceEvolutionChart, InvestmentSummaryCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly investmentService = inject(InvestmentService);

  readonly currentMonth = signal(new Date().getMonth() + 1);
  readonly currentYear = signal(new Date().getFullYear());

  summary = signal<DashboardSummary | null>(null);
  expensesByCategory = signal<ExpensesByCategory[]>([]);
  monthlyEvolution = signal<MonthlyEvolution[]>([]);
  savingsRate = signal<SavingsRate | null>(null);
  balanceEvolution = signal<BalanceEvolution[]>([]);
  portfolio = signal<PortfolioSummary | null>(null);
  error = signal('');

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  readonly months = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.currentMonth.set(this.month);
    this.currentYear.set(this.year);
    this.error.set('');

    this.dashboardService.getSummary(this.month, this.year).subscribe({
      next: (data) => this.summary.set(data),
      error: () => this.error.set('Erro ao carregar resumo do dashboard.'),
    });

    this.dashboardService.getExpensesByCategory(this.month, this.year).subscribe({
      next: (data) => this.expensesByCategory.set(data),
      error: () => this.error.set('Erro ao carregar despesas por categoria.'),
    });

    this.dashboardService.getMonthlyEvolution(12).subscribe({
      next: (data) => this.monthlyEvolution.set(data),
      error: () => this.error.set('Erro ao carregar evolução mensal.'),
    });

    this.dashboardService.getSavingsRate(this.month, this.year).subscribe({
      next: (data) => this.savingsRate.set(data),
      error: () => this.error.set('Erro ao carregar taxa de poupança.'),
    });

    this.dashboardService.getBalanceEvolution(12).subscribe({
      next: (data) => this.balanceEvolution.set(data),
      error: () => this.error.set('Erro ao carregar evolução do saldo.'),
    });

    this.investmentService.summary().subscribe({
      next: (data) => this.portfolio.set(data),
      error: () => {},
    });
  }
}
