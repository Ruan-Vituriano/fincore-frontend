import { Component, input, effect, ElementRef, viewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
import { BalanceEvolution } from '../../models/dashboard.model';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

@Component({
  selector: 'app-balance-evolution-chart',
  imports: [],
  templateUrl: './balance-evolution-chart.html',
  styleUrl: './balance-evolution-chart.css',
})
export class BalanceEvolutionChart {
  readonly data = input.required<BalanceEvolution[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const items = this.data();
      this.renderChart(items);
    });
  }

  private renderChart(items: BalanceEvolution[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const labels = items.map((i) => `${monthNames[i.month - 1]}/${i.year}`);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Saldo',
            data: items.map((i) => Number(i.balance)),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16 } },
        },
        scales: {
          y: { beginAtZero: false },
        },
      },
    });
  }
}
