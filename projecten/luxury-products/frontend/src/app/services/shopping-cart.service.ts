import { Injectable, signal, effect, inject } from '@angular/core';
import { Product } from '../models/Product';
import { CartItem } from '../models/CartItem';
import { GiftCard } from '../models/GiftCard';
import { firstValueFrom } from 'rxjs';
import { GiftCardService } from './gift-card.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private giftCardService = inject(GiftCardService);
  private userId: string | null = null;

  private cart = signal<CartItem[]>([]);
  private appliedGiftCard = signal<GiftCard | null>(null);

  constructor() {
    const savedUserId = localStorage.getItem('loggedInUserId');
    if (savedUserId) {
      this.setUser(savedUserId);
    }

    effect(() => {
      if (this.userId) {
        this.saveCartToLocalStorage();
      }
    });
  }

  public getAppliedGiftCard() {
    return this.appliedGiftCard;
  }

  public async applyGiftCard(code: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.giftCardService.redeemByCode(code));
      if (response) {
        this.appliedGiftCard.set(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying gift card:', error);
      return false;
    }
  }

  public removeGiftCard(): void {
    this.appliedGiftCard.set(null);
  }


  // Gebruiker
  public setUser(userId: string): void {
    this.userId = userId;
    localStorage.setItem('loggedInUserId', userId);
    this.cart.set(this.loadCartFromLocalStorage());
  }

  public getCart() {
    return this.cart;
  }

  // Cart functionaliteit
  public addToCart(product: Product): void {
    const existingItem = this.cart().find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.set([...this.cart(), { product, quantity: 1 }]);
    }

    this.saveCartToLocalStorage();
  }

  public removeFromCart(productId: number): void {
    this.cart.set(this.cart().filter(item => item.product.id !== productId));
    this.saveCartToLocalStorage();
  }

  public increaseQuantity(productId: number): void {
    this.cart.set(this.cart().map(item =>
      item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
    ));
    this.saveCartToLocalStorage();
  }

  public decreaseQuantity(productId: number): void {
    this.cart.set(this.cart().map(item => {
      if (item.product.id === productId) {
        return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item;
      }
      return item;
    }));
    this.saveCartToLocalStorage();
  }

  public clearCart(): void {
    this.removeGiftCard();
    this.cart.set([]);
    this.saveCartToLocalStorage();
  }

  // Berekeningen
  public getTotalPrice(): number {
    return this.cart().reduce((total, item) =>
        total + (item.product.price * item.quantity), 0);
  }

  public getFinalPrice(): number {
    let total = this.getTotalPrice();

    const giftCardBalance = this.appliedGiftCard()?.balance ?? 0;

    // If the total is less than the gift card balance, use the total amount
    // Otherwise, use the full gift card balance
    const discountAmount = Math.min(total, giftCardBalance);
    total -= discountAmount;

    return total > 0 ? parseFloat(total.toFixed(2)) : 0;
  }

  public getGiftCardUsedAmount(): number {
    const total = this.getTotalPrice();
    const giftCardBalance = this.appliedGiftCard()?.balance ?? 0;

    // Calculate how much of the gift card will be used
    return Math.min(total, giftCardBalance);
  }

  public getRemainingGiftCardBalance(): number {
    if (!this.appliedGiftCard()) {
      return 0;
    }

    const giftCardBalance = this.appliedGiftCard()?.balance ?? 0;
    const usedAmount = this.getGiftCardUsedAmount();

    return giftCardBalance - usedAmount;
  }

  // Local Storage
  private saveCartToLocalStorage(): void {
    if (this.userId) {
      const key = this.getCartKey();
      localStorage.setItem(key, JSON.stringify(this.cart()));
    }
  }

  private loadCartFromLocalStorage(): CartItem[] {
    if (this.userId) {
      const key = this.getCartKey();
      const savedCart = localStorage.getItem(key);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  }

  private getCartKey(): string {
    return `shoppingCart_${this.userId}`;
  }
}
