import { Component, input, effect, ElementRef, viewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
import { MonthlyEvolution } from '../../models/dashboard.model';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

@Component({
  selector: 'app-monthly-evolution-chart',
  imports: [],
  templateUrl: './monthly-evolution-chart.html',
  styleUrl: './monthly-evolution-chart.css',
})
export class MonthlyEvolutionChart {
  readonly data = input.required<MonthlyEvolution[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const items = this.data();
      this.renderChart(items);
    });
  }

  private renderChart(items: MonthlyEvolution[]): void {
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
            label: 'Receitas',
            data: items.map((i) => Number(i.income)),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Despesas',
            data: items.map((i) => Number(i.expense)),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
          y: { beginAtZero: true },
        },
      },
    });
  }
}
