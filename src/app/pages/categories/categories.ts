import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryRequest, CategoryType } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private readonly categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  form: CategoryRequest = { name: '', type: 'EXPENSE' };
  readonly types: CategoryType[] = ['INCOME', 'EXPENSE'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.list().subscribe({
      next: (data) => this.categories.set(data),
      error: () => this.error.set('Erro ao carregar categorias.'),
    });
  }

  openCreate(): void {
    this.form = { name: '', type: 'EXPENSE' };
    this.editingId.set(null);
    this.error.set('');
    this.showModal.set(true);
  }

  openEdit(category: Category): void {
    this.form = { name: category.name, type: category.type, icon: category.icon, color: category.color };
    this.editingId.set(category.id);
    this.error.set('');
    this.showModal.set(true);
  }

  save(): void {
    if (!this.form.name) {
      this.error.set('Nome é obrigatório.');
      return;
    }

    this.loading.set(true);
    const id = this.editingId();
    const request$ = id
      ? this.categoryService.update(id, this.form)
      : this.categoryService.create(this.form);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.load();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Erro ao salvar.');
      },
    });
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    this.categoryService.delete(id).subscribe({ next: () => this.load() });
  }
}
