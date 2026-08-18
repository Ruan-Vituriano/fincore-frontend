import { Component, input, effect, ElementRef, viewChild } from '@angular/core';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { ExpensesByCategory } from '../../models/dashboard.model';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-expenses-by-category-chart',
  imports: [],
  templateUrl: './expenses-by-category-chart.html',
  styleUrl: './expenses-by-category-chart.css',
})
export class ExpensesByCategoryChart {
  readonly data = input.required<ExpensesByCategory[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const items = this.data();
      this.renderChart(items);
    });
  }

  private renderChart(items: ExpensesByCategory[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    ];

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: items.map((i) => i.categoryName),
        datasets: [
          {
            data: items.map((i) => Number(i.total)),
            backgroundColor: colors.slice(0, items.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16 } },
        },
      },
    });
  }
}
