import {Component, DestroyRef, inject, signal, OnInit, computed, OnDestroy} from '@angular/core';
import {ProductComponent} from './product/product.component';
import {Product} from '../models/Product';
import {ProductService} from '../services/product.service';
import {CategoryListComponent} from '../category-list/category-list.component';
import {CategoryService} from '../services/category.service';
import {NgFor} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductComponent,
    CategoryListComponent,
    NgFor,
    TranslateModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isFetching = signal(false);
  error = signal('');
  private subscriptions = new Subscription();

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  selectedCategory = computed(() => this.categoryService.selectedCategory());

  displayedProducts = computed(() =>
    this.selectedCategory() ? this.selectedCategory()!.products : this.products()
  );

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.productService.loadProducts().subscribe({
      next: (products: Product[]) => {
        products.sort((a, b) => a.name.localeCompare(b.name));
        this.products.set(products);
        this.filteredProducts.set(products);
        this.isFetching.set(false);
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error.set(error.message);
        this.isFetching.set(false);
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
