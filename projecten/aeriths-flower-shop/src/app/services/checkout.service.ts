import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Purchase } from '../common/purchase';
import { OrderHistory } from '../common/order-history';
import { OrderHistoryService } from './order-history.service';

// Demoversie: de bestelling wordt lokaal opgeslagen in plaats van naar de backend gestuurd.
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  constructor(private orderHistory: OrderHistoryService) {}

  placeOrder(purchase: Purchase): Observable<any> {
    const trackingNumber = 'AFS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    this.orderHistory.addOrder(new OrderHistory(
      String(Date.now()), trackingNumber,
      purchase.order?.totalPrice ?? 0, purchase.order?.totalQuantity ?? 0, new Date()));
    return of({ orderTrackingNumber: trackingNumber });
  }
}
