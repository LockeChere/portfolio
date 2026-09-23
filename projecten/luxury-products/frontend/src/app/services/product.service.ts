import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { Observable, of, throwError } from 'rxjs';
import { demoDb } from '../demo/demo-db';

type StockStatus = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

// Demoversie: producten komen uit de in-browser demo-database (zie demo/demo-db.ts).
@Injectable({ providedIn: 'root' })
export class ProductService {

  getProducts(): Observable<Product[]> {
    return of(demoDb.products.get().map(p => ({ ...p, stockStatus: this.getStockStatus(p.stock) })));
  }

  loadProducts(): Observable<Product[]> {
    return this.getProducts();
  }

  getProduct(id: number): Observable<Product> {
    const product = demoDb.products.get().find(p => p.id === +id);
    if (!product) return throwError(() => ({ status: 404, message: 'Product niet gevonden' }));
    return of({ ...product, stockStatus: this.getStockStatus(product.stock) });
  }

  getProductById(id: number): Observable<Product> {
    return this.getProduct(id);
  }

  private getStockStatus(stock: number): StockStatus {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= 5) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
}
