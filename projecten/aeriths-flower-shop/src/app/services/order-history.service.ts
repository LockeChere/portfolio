import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { DemoStore } from '../demo/demo-store';

// Demoversie: bestellingen worden in de browser bewaard.
@Injectable({ providedIn: 'root' })
export class OrderHistoryService {
  private store = new DemoStore<OrderHistory[]>('flowershop-orders', () => [
    new OrderHistory('1', 'AFS-7Q2K9D1X', 29.97, 3, new Date('2025-03-01')),
    new OrderHistory('2', 'AFS-3M8T5B0L', 34.99, 1, new Date('2025-04-12')),
  ]);

  getOrderHistory(): Observable<OrderHistory[]> {
    return of([...this.store.get()].reverse());
  }

  addOrder(order: OrderHistory): void {
    const all = this.store.get();
    all.push(order);
    this.store.set(all);
  }
}
