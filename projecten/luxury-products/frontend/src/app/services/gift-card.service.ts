import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { GiftCard } from '../models/GiftCard';
import { Product } from '../models/Product';
import { demoDb, GIFTCARD_IMG } from '../demo/demo-db';

// Demoversie: zelfde endpoints als GiftCardController / AdminController, maar in de browser.
@Injectable({ providedIn: 'root' })
export class GiftCardService {

  private cat() { return demoDb.categories().find(c => c.name === 'Cadeaubonnen')!; }

  getAll(): Observable<GiftCard[]> {
    return of(demoDb.giftCards.get());
  }

  /** POST /giftcards/redeem — alleen geldige, niet-gebruikte kaarten met saldo. */
  redeemByCode(code: string): Observable<GiftCard> {
    const card = demoDb.giftCards.get().find(g => g.code === (code || '').trim());
    if (!card || card.used || card.balance <= 0) return throwError(() => ({ status: 400, message: 'Ongeldige of gebruikte cadeaubon' }));
    return of(card);
  }

  getByCode(code: string): Observable<GiftCard> {
    const card = demoDb.giftCards.get().find(g => g.code === code);
    return card ? of(card) : throwError(() => ({ status: 404, message: 'Niet gevonden' }));
  }

  updateBalance(code: string, balance: number): Observable<GiftCard> {
    const cards = demoDb.giftCards.get();
    const card = cards.find(g => g.code === code);
    if (!card || balance < 0) return throwError(() => ({ status: 400 }));
    card.balance = balance;
    card.used = balance === 0;
    demoDb.giftCards.set(cards);
    return of(card);
  }

  getAllPurchasedGiftCards(): Observable<GiftCard[]> {
    return of(demoDb.giftCards.get());
  }

  createPurchasedGiftCard(giftCard: { value: number, categoryId?: number | null }): Observable<GiftCard> {
    const cards = demoDb.giftCards.get();
    const card: GiftCard = {
      id: demoDb.nextId(cards), value: giftCard.value, balance: giftCard.value, used: false,
      code: demoDb.newCode(), category: { ...this.cat() },
    };
    cards.push(card);
    demoDb.giftCards.set(cards);
    return of(card);
  }

  updatePurchasedGiftCard(id: number, giftCard: any): Observable<GiftCard> {
    const cards = demoDb.giftCards.get();
    const i = cards.findIndex(g => g.id === id);
    if (i === -1) return throwError(() => ({ status: 404 }));
    const oldValue = cards[i].value;
    const spent = oldValue - cards[i].balance;
    const value = giftCard.value ?? oldValue;
    cards[i] = { ...cards[i], value, balance: Math.max(0, value - spent) };
    cards[i].used = cards[i].balance === 0;
    demoDb.giftCards.set(cards);
    return of(cards[i]);
  }

  deletePurchasedGiftCard(id: number): Observable<void> {
    demoDb.giftCards.set(demoDb.giftCards.get().filter(g => g.id !== id));
    return of(void 0);
  }

  getAllGiftCardProducts(): Observable<Product[]> {
    return of(demoDb.products.get().filter(p => demoDb.isGiftCardProduct(p)));
  }

  createGiftCardProduct(product: any): Observable<Product> {
    const products = demoDb.products.get();
    const cat = this.cat();
    const created: Product = {
      id: demoDb.nextId(products),
      name: `Cadeaubon €${product.value}`,
      description: `Cadeaubon ter waarde van €${product.value}`,
      price: product.value,
      imageUrl: product.imageUrl || GIFTCARD_IMG,
      stock: product.stock ?? 100,
      categoryId: cat.id,
      category: { ...cat },
    };
    products.push(created);
    demoDb.products.set(products);
    return of(created);
  }

  updateGiftCardProduct(id: number, product: any): Observable<Product> {
    const products = demoDb.products.get();
    const i = products.findIndex(p => p.id === id);
    if (i === -1) return throwError(() => ({ status: 404 }));
    const { categoryId, ...rest } = product;
    products[i] = { ...products[i], ...rest };
    demoDb.products.set(products);
    return of(products[i]);
  }

  deleteGiftCardProduct(id: number): Observable<void> {
    demoDb.products.set(demoDb.products.get().filter(p => p.id !== id));
    return of(void 0);
  }
}
