import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Order } from '../models/Order';
import { ResponseOrderData } from '../models/ResponseOrderData';
import { ShoppingCartService } from './shopping-cart.service';
import { UserService } from './user.service';
import { demoDb } from '../demo/demo-db';

// Demoversie: bestellingen worden verwerkt door de in-browser demo-database,
// met dezelfde regels als de backend (voorraad, cadeaubonnen aanmaken en inwisselen).
@Injectable({ providedIn: 'root' })
export class OrderService {
  private cartService = inject(ShoppingCartService);
  private userService = inject(UserService);

  public fetchOrdersByUserId(userId: string | null): Observable<Order[]> {
    const id = Number(userId);
    return of(demoDb.orders.get().filter(o => o.user.id === id).reverse());
  }

  getOrderById(orderId: number): Observable<Order> {
    const order = demoDb.orders.get().find(o => o.id === orderId);
    return order ? of(order) : throwError(() => ({ status: 404 }));
  }

  createOrder(userId: number, shippingAddress: string): Observable<ResponseOrderData> {
    const cartItems = this.cartService.getCart()();
    const applied = this.cartService.getAppliedGiftCard()();
    try {
      const order = demoDb.createOrder(userId, shippingAddress,
        cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        applied?.code);
      this.cartService.removeGiftCard();
      return of(order as unknown as ResponseOrderData);
    } catch (e: any) {
      return throwError(() => ({ status: e.status ?? 500, message: e.message }));
    }
  }

  getAllOrders(): Observable<Order[]> {
    return of(demoDb.orders.get());
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.getOrderById(orderId);
  }

  cancelOrder(orderId: number): Observable<void> {
    return of(void 0);
  }

  getUserId(): number | null {
    const userId = this.userService.getUserId();
    return userId ? +userId : null;
  }
}
