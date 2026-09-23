import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { DemoStore } from '../demo/demo-store';

// Demoversie: producten komen uit de browser in plaats van uit de Spring Boot-API.
const CATEGORIES: ProductCategory[] = [
  new ProductCategory(1, 'Bloemen'),
  new ProductCategory(2, 'Gereedschap'),
  new ProductCategory(3, 'Boeketten'),
];

const SEED: Product[] = [
  new Product(1, 'Red Rose', 3.99, 'img/rose.png', 1, true, 50, 'A beautiful red rose'),
  new Product(2, 'Sunflower', 2.99, 'img/sunflower.png', 1, true, 40, 'A beautiful sunflower'),
  new Product(3, 'Lily', 4.49, 'img/lily.png', 1, true, 30, 'A beautiful white lily'),
  new Product(4, 'Spider Lily', 5.99, 'img/spiderlily.png', 1, true, 15, 'A beautiful spider lily'),
  new Product(5, 'Purple Tulip', 2.49, 'img/tulip.png', 1, true, 60, 'A beautiful purple tulip'),
  new Product(6, 'Watering Can', 12.99, 'img/wateringcan.png', 2, true, 12, 'A handy watering can for when the plants need water'),
  new Product(7, 'Rake', 17.50, 'img/rake.png', 2, true, 10, 'To remove leaves from the garden'),
  new Product(8, 'Shovel', 14.99, 'img/shovel.png', 2, true, 18, 'A handy shovel to dig away soil'),
  new Product(9, 'Pickaxe', 24.99, 'img/pickaxe.png', 2, true, 6, 'To remove stones'),
  new Product(10, 'Hand Saw', 19.99, 'img/saw.png', 2, true, 9, 'To saw through wood'),
  new Product(11, 'Graduation Bouquet', 29.99, 'img/gradbouquet.png', 3, true, 8, 'For when someone has graduated'),
  new Product(12, 'Funeral Bouquet', 39.99, 'img/funebouquet.png', 3, true, 5, 'Bouquet for a funeral'),
  new Product(13, 'Wedding Bouquet', 49.99, 'img/marbouquet.png', 3, true, 4, 'Bouquet for when someone is getting married'),
  new Product(14, "Valentine's Day Bouquet", 34.99, 'img/valbouquet.png', 3, true, 10, "A bouquet for Valentine's Day"),
  new Product(15, 'Birthday Bouquet', 24.99, 'img/birbouquet.png', 3, true, 12, 'A colourful birthday bouquet'),
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private store = new DemoStore<Product[]>('flowershop-products', () => SEED.map(p => ({ ...p })));

  private all(): Product[] { return this.store.get(); }

  getProductsOnMain(): Observable<Product[]> {
    return of(this.all());
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    if (!theCategoryId) return of(this.all());
    return of(this.all().filter(p => +p.categoryId === +theCategoryId));
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const k = (theKeyword || '').toLowerCase();
    return of(this.all().filter(p => p.name.toLowerCase().includes(k) || (p.description || '').toLowerCase().includes(k)));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return of(CATEGORIES);
  }

  getProduct(theProductId: number): Observable<Product> {
    const all = this.all();
    return of(all.find(p => p.id === +theProductId) || all[0]);
  }

  addProduct(product: Product): Observable<Product> {
    const all = this.all();
    const created = { ...product, id: Math.max(0, ...all.map(p => p.id)) + 1 };
    all.push(created);
    this.store.set(all);
    return of(created);
  }

  deleteProduct(id: number): Observable<void> {
    this.store.set(this.all().filter(p => p.id !== +id));
    return of(void 0);
  }

  updateProduct(product: Partial<Product> & { id: number }): Observable<Product> {
    const all = this.all();
    const i = all.findIndex(p => p.id === +product.id);
    if (i >= 0) {
      const patch: any = { ...product };
      if (patch.transDescription && !patch.description) patch.description = patch.transDescription;
      all[i] = { ...all[i], ...patch };
      this.store.set(all);
      return of(all[i]);
    }
    return of(product as Product);
  }
}
