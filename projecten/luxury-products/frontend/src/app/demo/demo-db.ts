/**
 * In-browser "backend" voor de GitHub Pages-demo.
 * Bootst de logica van de Spring Boot-API na (Seeder, OrderService, GiftCardController),
 * zodat de webshop en het giftcard-systeem zonder server werken.
 */
import { DemoStore } from './demo-store';
import { Product } from '../models/Product';
import { GiftCard } from '../models/GiftCard';
import { Order } from '../models/Order';

export interface DemoUser { id: number; email: string; password: string; role: 'ROLE_USER' | 'ROLE_ADMIN'; }
export interface DemoCategory { id: number; name: string; }

export const GIFTCARD_IMG = 'assets/images/giftcard.png';

const CATEGORIES: DemoCategory[] = [
  { id: 1, name: 'Horloges' },
  { id: 2, name: 'Armbanden' },
  { id: 3, name: 'Tassen' },
  { id: 4, name: 'Brillen' },
  { id: 5, name: 'Cadeaubonnen' },
];

function p(id: number, name: string, description: string, price: number, imageUrl: string, categoryId: number, stock: number): Product {
  return { id, name, description, price, imageUrl, stock, categoryId, category: { ...CATEGORIES[categoryId - 1] } };
}

function seedProducts(): Product[] {
  const products: Product[] = [
    p(1, 'Rolex Submariner', 'Iconisch duikhorloge met zwarte wijzerplaat en keramische bezel. Een tijdloos statussymbool.', 7999.99, 'https://i0.wp.com/wannabuyawatch.com/wp-content/uploads/2021/03/52078.jpg?fit=960%2C1280&ssl=1', 1, 5),
    p(2, 'Omega Speedmaster', 'De legendarische Moonwatch die gedragen werd tijdens Apollo-missies. Elegant en sportief.', 6299.00, 'https://www.eugenevanbaal.nl/media/catalog/product/cache/4f2c711297192d1e648fdfaf4a68b673/3/2/32930445104001.webp', 1, 3),
    p(3, 'Cartier Love Bracelet', 'Gouden armband met schroefsysteem. Symbool van eeuwige liefde en toewijding.', 7150.00, 'https://a.1stdibscdn.com/archivesE/upload/j_214/15_15/org_mtsj118232/MTSJ118232_l.jpeg?disable=upscale&auto=webp&quality=60&width=1400', 2, 8),
    p(4, 'Tiffany & Co. T Wire Bracelet', 'Minimalistische armband in 18k goud met iconisch T-ontwerp. Subtiel en stijlvol.', 3450.00, 'https://www.net-a-porter.com/variants/images/17957409494218415/in/w2000_q60.jpg', 2, 12),
    p(5, 'Louis Vuitton Neverfull MM', 'Luxe handtas van gecoat canvas en leer. Ruim, stijlvol en herkenbaar aan het LV-monogram.', 1650.00, 'https://en.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-neverfull-mm--N40599_PM1_Side%20view.png?wid=2400&hei=2400', 3, 6),
    p(6, 'Chanel Classic Flap Bag', 'Elegante tas met kettingband en quilted leer. Een modeklassieker die nooit uit de mode raakt.', 7950.00, 'https://images.vestiairecollective.com/images/resized/w=1024,q=75,f=auto,/produit/chanel-timeless-classique-leer-zwart-handtas-48641947-1_3.jpg', 3, 4),
    p(7, 'Ray-Ban Aviator Gold', 'De originele pilotenbril met gouden frame en groene lenzen. Tijdloos design.', 599.00, 'https://grandvision-media.imgix.net/m/6167739297197404/original_png-0RB3025__001_51__STD__shad__qt.png?w=1440&auto=format', 4, 15),
    p(8, 'Gucci GG0406S', 'Statement zonnebril met goudkleurig frame en oversized lenzen. Onmiskenbaar Gucci.', 690.00, 'https://grandvision-media.imgix.net/m/7a7a65e179d137dc/original_png-gucci_gg0121o_8056376076967_00025.png?w=1440&auto=format', 4, 10),
    p(9, 'Persol PO0714 Folding', 'Handgemaakte zonnebril uit Italië, bekend van Steve McQueen. Inklapbaar en stijlvol.', 520.00, 'https://image4.cdnsbg.com/1/73/15835_side_1_1609226326671.jpg?width=900&height=450&q=90', 4, 7),
    p(10, 'Tag Heuer Carrera Calibre 5', 'Automatisch horloge met sportief design en Zwitserse precisie. Perfect voor dagelijks gebruik.', 2850.00, 'https://chronexttime.imgix.net/V/8/V85849/V85849_1_det.png?w=570&ar=1:1&auto=format&fm=png&q=55&usm=50&usmrad=1.5&dpr=2&trim=color&fit=fill&auto=compress&bg=FFFFFF&bg-remove=true', 1, 9),
  ];
  [25, 50, 75, 100, 200, 500, 1000, 2000, 5000, 6000, 10000].forEach((v, i) =>
    products.push(p(11 + i, `Cadeaubon €${v}`, `Cadeaubon ter waarde van €${v}`, v, GIFTCARD_IMG, 5, 100)));
  return products;
}

function seedUsers(): DemoUser[] {
  return [
    { id: 1, email: 'admin@test.nl', password: 'Admin123!', role: 'ROLE_ADMIN' },
    { id: 2, email: 'demo@test.nl', password: 'Demo123!', role: 'ROLE_USER' },
  ];
}

function seedGiftCards(): GiftCard[] {
  return [
    { id: 1, value: 100, balance: 100, used: false, code: 'DEMO-100', category: { id: 5, name: 'Cadeaubonnen' } },
    { id: 2, value: 50, balance: 20, used: false, code: 'DEMO-50', category: { id: 5, name: 'Cadeaubonnen' } },
  ];
}

function seedOrders(): Order[] {
  return [{
    id: 1,
    user: { id: 2, email: 'demo@test.nl' },
    orderItems: [
      { id: 1, productId: 7, productName: 'Ray-Ban Aviator Gold', quantity: 1, price: 599 },
      { id: 2, productId: 14, productName: 'Cadeaubon €100', quantity: 1, price: 100, giftCardCode: 'DEMO-100' },
    ],
    shippingAddress: 'Zernikedreef 11 Leiden 2333 CK',
    totalPrice: 699,
    orderDate: '2025-05-12T10:30:00.000Z',
  }];
}

export class HttpLikeError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

class DemoDb {
  products = new DemoStore<Product[]>('lux-products', seedProducts);
  users = new DemoStore<DemoUser[]>('lux-users', seedUsers);
  giftCards = new DemoStore<GiftCard[]>('lux-giftcards', seedGiftCards);
  orders = new DemoStore<Order[]>('lux-orders', seedOrders);

  categories(): DemoCategory[] { return CATEGORIES; }

  nextId(list: { id?: number }[]): number {
    return Math.max(0, ...list.map(x => x.id ?? 0)) + 1;
  }

  newCode(): string {
    const c = (globalThis.crypto as any)?.randomUUID?.() as string | undefined;
    return c ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
      const r = Math.random() * 16 | 0; return (ch === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  isGiftCardProduct(prod: Product): boolean {
    return prod.category?.name === 'Cadeaubonnen'
      || (prod.name ?? '').toLowerCase().includes('cadeaubon')
      || (prod.description ?? '').toLowerCase().includes('cadeaubon');
  }

  /** Zelfde logica als OrderService.createOrder in de Spring Boot-backend. */
  createOrder(userId: number, shippingAddress: string,
              items: { productId: number; productName: string; quantity: number; price: number }[],
              appliedGiftCardCode?: string): Order {
    const user = this.users.get().find(u => u.id === userId);
    if (!user) throw new HttpLikeError(404, 'Gebruiker niet gevonden');
    const products = this.products.get();

    for (const it of items) {
      const prod = products.find(x => x.id === it.productId);
      if (!prod) throw new HttpLikeError(400, 'Product bestaat niet');
      if (prod.stock < it.quantity) throw new HttpLikeError(400, `Niet genoeg voorraad voor ${prod.name}`);
    }

    const cards = this.giftCards.get();
    const orders = this.orders.get();
    let total = 0;
    const orderItems = items.map((it, i) => {
      const prod = products.find(x => x.id === it.productId)!;
      prod.stock -= it.quantity;
      const oi: any = { id: i + 1, productId: it.productId, productName: it.productName, quantity: it.quantity, price: it.price };
      if (this.isGiftCardProduct(prod)) {
        const codes: string[] = [];
        for (let q = 0; q < it.quantity; q++) {
          const card: GiftCard = { id: this.nextId(cards), value: Math.trunc(it.price), balance: Math.trunc(it.price), used: false, code: this.newCode(), category: prod.category };
          cards.push(card);
          codes.push(card.code);
        }
        oi.giftCardCode = codes.join(',');
      }
      total += it.price * it.quantity;
      return oi;
    });

    if (appliedGiftCardCode?.trim()) {
      const card = cards.find(c => c.code === appliedGiftCardCode.trim() && !c.used && c.balance > 0);
      if (card) {
        const use = Math.min(total, card.balance);
        total = Math.max(0, total - use);
        card.balance = card.balance - Math.trunc(use);
        card.used = card.balance === 0;
      }
    }

    const order: Order = {
      id: this.nextId(orders), user: { id: user.id, email: user.email }, orderItems,
      shippingAddress, totalPrice: Math.round(total * 100) / 100, orderDate: new Date().toISOString(),
    };
    orders.push(order);
    this.products.set(products);
    this.giftCards.set(cards);
    this.orders.set(orders);
    return order;
  }
}

export const demoDb = new DemoDb();
