import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { FinancialGoal, GoalRequest, GoalProgress } from '../../models/goal.model';

@Component({
  selector: 'app-goals',
  imports: [FormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class Goals implements OnInit {
  private readonly goalService = inject(GoalService);

  goals = signal<FinancialGoal[]>([]);
  progressMap = signal<Map<string, GoalProgress>>(new Map());
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  form: GoalRequest = { name: '', targetAmount: 0, currentAmount: 0 };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.goalService.list().subscribe({
      next: (data) => {
        this.goals.set(data);
        data.forEach((g) => this.loadProgress(g.id));
      },
      error: () => this.error.set('Erro ao carregar metas.'),
    });
  }

  loadProgress(id: string): void {
    this.goalService.progress(id).subscribe({
      next: (progress) => {
        this.progressMap.update((map) => {
          const newMap = new Map(map);
          newMap.set(id, progress);
          return newMap;
        });
      },
    });
  }

  openCreate(): void {
    this.form = { name: '', targetAmount: 0, currentAmount: 0 };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(goal: FinancialGoal): void {
    this.form = { name: goal.name, targetAmount: goal.targetAmount, currentAmount: goal.currentAmount };
    this.editingId.set(goal.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.name || !this.form.targetAmount) {
      this.error.set('Nome e valor da meta são obrigatórios.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.goalService.update(id, this.form)
      : this.goalService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
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
    this.goalService.delete(id).subscribe({ next: () => this.load() });
  }

  getProgress(id: string): GoalProgress | undefined {
    return this.progressMap().get(id);
  }
}
