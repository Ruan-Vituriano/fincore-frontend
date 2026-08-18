import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../services/investment.service';
import { AiService } from '../../services/ai.service';
import { Investment, InvestmentRequest, PortfolioSummary, INVESTMENT_TYPE_LABELS, InvestmentType } from '../../models/investment.model';

@Component({
  selector: 'app-investments',
  imports: [FormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './investments.html',
  styleUrl: './investments.css',
})
export class Investments implements OnInit {
  private readonly investmentService = inject(InvestmentService);
  private readonly aiService = inject(AiService);

  investments = signal<Investment[]>([]);
  portfolio = signal<PortfolioSummary | null>(null);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');
  aiLoading = signal(false);
  aiResult = signal('');
  showAiPanel = signal(false);

  form: InvestmentRequest = {
    name: '',
    ticker: '',
    type: 'ACAO',
    amountInvested: 0,
    currentValue: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  };

  readonly typeLabels = INVESTMENT_TYPE_LABELS;
  readonly typeColors: Record<string, string> = {
    ACAO: 'bg-blue-100 text-blue-700',
    FII: 'bg-purple-100 text-purple-700',
    RENDA_FIXA: 'bg-green-100 text-green-700',
    CRIPTO: 'bg-orange-100 text-orange-700',
    FUNDO: 'bg-cyan-100 text-cyan-700',
    OUTROS: 'bg-gray-100 text-gray-700',
  };

  readonly investmentTypes: InvestmentType[] = ['ACAO', 'FII', 'RENDA_FIXA', 'CRIPTO', 'FUNDO', 'OUTROS'];

  ngOnInit(): void {
    this.load();
    this.loadSummary();
  }

  load(): void {
    this.investmentService.list().subscribe({
      next: (data) => this.investments.set(data),
      error: () => this.error.set('Erro ao carregar investimentos.'),
    });
  }

  loadSummary(): void {
    this.investmentService.summary().subscribe({
      next: (data) => this.portfolio.set(data),
      error: () => this.error.set('Erro ao carregar resumo da carteira.'),
    });
  }

  openCreate(): void {
    this.form = {
      name: '',
      ticker: '',
      type: 'ACAO',
      amountInvested: 0,
      currentValue: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(investment: Investment): void {
    this.form = {
      name: investment.name,
      ticker: investment.ticker ?? '',
      type: investment.type,
      amountInvested: investment.amountInvested,
      currentValue: investment.currentValue,
      purchaseDate: investment.purchaseDate,
      notes: investment.notes ?? '',
    };
    this.editingId.set(investment.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.name || !this.form.amountInvested || !this.form.currentValue || !this.form.purchaseDate) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.investmentService.update(id, this.form)
      : this.investmentService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
        this.loadSummary();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Erro ao salvar.');
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    this.investmentService.delete(id).subscribe({ next: () => { this.load(); this.loadSummary(); } });
  }

  analyzeWithAI(): void {
    this.aiLoading.set(true);
    this.showAiPanel.set(true);
    this.aiResult.set('');

    this.aiService.investmentAnalysis().subscribe({
      next: (response) => {
        this.aiLoading.set(false);
        this.aiResult.set(response.suggestion);
      },
      error: (err) => {
        this.aiLoading.set(false);
        this.aiResult.set(err.error?.detail ?? 'Erro ao obter análise da IA.');
      },
    });
  }

  getAllocationEntries(): [string, { amount: number; percentage: number }][] {
    const p = this.portfolio();
    if (!p) return [];
    return Object.entries(p.allocationByType);
  }

  hasAllocation(allocation: Record<string, { amount: number; percentage: number }>): boolean {
    return Object.keys(allocation).length > 0;
  }

  getLabel(type: string): string {
    return INVESTMENT_TYPE_LABELS[type as InvestmentType] ?? type;
  }
}
