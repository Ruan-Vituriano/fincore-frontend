import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category, CategoryRequest } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = inject(ApiService);

  list(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories');
  }

  create(request: CategoryRequest): Observable<Category> {
    return this.api.post<Category>('/categories', request);
  }

  update(id: string, request: CategoryRequest): Observable<Category> {
    return this.api.put<Category>(`/categories/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
