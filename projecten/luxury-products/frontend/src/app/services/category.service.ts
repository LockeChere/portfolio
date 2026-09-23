import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/Category';
import { demoDb } from '../demo/demo-db';

// Demoversie: categorieën (met hun producten) uit de in-browser demo-database.
@Injectable({ providedIn: 'root' })
export class CategoryService {
  selectedCategory = signal<Category | null>(null);

  public loadCategories(): Observable<Category[]> {
    const products = demoDb.products.get();
    return of(demoDb.categories().map(c => ({
      id: c.id,
      name: c.name,
      products: products.filter(p => (p.categoryId ?? p.category?.id) === c.id),
    })));
  }
}
