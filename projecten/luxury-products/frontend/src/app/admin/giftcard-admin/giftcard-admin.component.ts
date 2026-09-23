import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GiftCardService } from '../../services/gift-card.service';
import { CategoryService } from '../../services/category.service';
import { GiftCard } from '../../models/GiftCard';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-giftcard-admin',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './giftcard-admin.component.html',
  styleUrls: ['./giftcard-admin.component.scss']
})
export class GiftcardAdminComponent implements OnInit {
  // Tab management
  activeTab: 'purchased' | 'products' = 'purchased';

  // Purchased gift cards (GiftCard entities)
  purchasedGiftCards: GiftCard[] = [];
  editingPurchasedGiftCard: GiftCard | null = null;
  newPurchasedGiftCard = { value: 0, categoryId: null as number | null };
  purchasedGiftCardEditForm = { 
    value: 0, 
    categoryId: null as number | null
  };

  // Gift card products (Product entities)
  giftCardProducts: Product[] = [];
  editingGiftCardProduct: Product | null = null;
  newGiftCardProduct = { 
    value: 0, 
    categoryId: null as number | null,
    imageUrl: 'https://bing.com/th/id/BCO.f9a16291-b734-4ce7-aa0b-8eb4f6744c60.png',
    stock: 100
  };
  giftCardProductEditForm = {} as { 
    name?: string, 
    description?: string, 
    price?: number, 
    imageUrl?: string, 
    stock?: number, 
    categoryId?: number | null 
  };

  // Shared
  categories: Category[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private giftCardService: GiftCardService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPurchasedGiftCards();
    this.loadGiftCardProducts();
  }

  // Tab management
  setActiveTab(tab: 'purchased' | 'products'): void {
    this.activeTab = tab;
    this.cancelEditing();
  }

  // Shared methods
  loadCategories(): void {
    this.handleRequest(
      this.categoryService.loadCategories(),
      data => {
        this.categories = data;
        // Set default category for new gift card products to "Cadeaubonnen"
        const cadeaubonnenCategory = this.categories.find(category => category.name === 'Cadeaubonnen');
        if (cadeaubonnenCategory) {
          this.newGiftCardProduct.categoryId = cadeaubonnenCategory.id;
        }
      },
      'Failed to load categories'
    );
  }

  cancelEditing(): void {
    this.editingPurchasedGiftCard = null;
    this.editingGiftCardProduct = null;
  }

  // Generic request handler to reduce code duplication
  private handleRequest<T>(
    request: Observable<T>, 
    successCallback: (data: T) => void, 
    errorMessage: string
  ): void {
    this.loading = true;
    this.error = '';

    request.subscribe({
      next: (data) => {
        successCallback(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = errorMessage;
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Purchased gift cards methods
  loadPurchasedGiftCards(): void {
    this.handleRequest(
      this.giftCardService.getAllPurchasedGiftCards(),
      data => this.purchasedGiftCards = data,
      'Failed to load purchased gift cards'
    );
  }

  createPurchasedGiftCard(): void {
    if (this.newPurchasedGiftCard.value <= 0) {
      this.error = 'Gift card value must be greater than 0';
      return;
    }

    this.handleRequest(
      this.giftCardService.createPurchasedGiftCard(this.newPurchasedGiftCard),
      data => {
        this.purchasedGiftCards.push(data);
        this.newPurchasedGiftCard = { value: 0, categoryId: null };
      },
      'Failed to create purchased gift card'
    );
  }

  startEditingPurchasedGiftCard(giftCard: GiftCard): void {
    this.editingPurchasedGiftCard = { ...giftCard };
    this.purchasedGiftCardEditForm = {
      value: giftCard.value,
      categoryId: giftCard.category?.id || null
    };
  }

  savePurchasedGiftCard(): void {
    if (!this.editingPurchasedGiftCard) return;

    // Ensure we use the original category ID
    const updateData = {
      ...this.purchasedGiftCardEditForm,
      categoryId: this.editingPurchasedGiftCard.category?.id || null
    };

    this.handleRequest(
      this.giftCardService.updatePurchasedGiftCard(
        this.editingPurchasedGiftCard.id!, 
        updateData
      ),
      data => {
        const index = this.purchasedGiftCards.findIndex(g => g.id === data.id);
        if (index !== -1) {
          this.purchasedGiftCards[index] = data;
        }
        this.editingPurchasedGiftCard = null;
      },
      'Failed to update purchased gift card'
    );
  }

  deletePurchasedGiftCard(id: number): void {
    if (!confirm('Are you sure you want to delete this purchased gift card?')) return;

    this.handleRequest(
      this.giftCardService.deletePurchasedGiftCard(id),
      () => {
        this.purchasedGiftCards = this.purchasedGiftCards.filter(g => g.id !== id);
      },
      'Failed to delete purchased gift card'
    );
  }

  // Gift card products methods
  loadGiftCardProducts(): void {
    this.handleRequest(
      this.giftCardService.getAllGiftCardProducts(),
      data => this.giftCardProducts = data,
      'Failed to load gift card products'
    );
  }

  createGiftCardProduct(): void {
    if (this.newGiftCardProduct.value <= 0) {
      this.error = 'Gift card product value must be greater than 0';
      return;
    }

    this.handleRequest(
      this.giftCardService.createGiftCardProduct(this.newGiftCardProduct),
      data => {
        this.giftCardProducts.push(data);
        // Reset form but keep the Cadeaubonnen category
        const currentCategoryId = this.newGiftCardProduct.categoryId;
        this.newGiftCardProduct = { 
          value: 0, 
          categoryId: currentCategoryId, // Keep the current category (should be Cadeaubonnen)
          imageUrl: 'https://bing.com/th/id/BCO.f9a16291-b734-4ce7-aa0b-8eb4f6744c60.png',
          stock: 100
        };
      },
      'Failed to create gift card product'
    );
  }

  startEditingGiftCardProduct(product: Product): void {
    this.editingGiftCardProduct = { ...product };
    this.giftCardProductEditForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      categoryId: product.category?.id || null
    };
  }

  saveGiftCardProduct(): void {
    if (!this.editingGiftCardProduct) return;

    // Ensure we use the original category ID
    const updateData = {
      ...this.giftCardProductEditForm,
      categoryId: this.editingGiftCardProduct.category?.id || null
    };

    this.handleRequest(
      this.giftCardService.updateGiftCardProduct(
        this.editingGiftCardProduct.id, 
        updateData
      ),
      data => {
        const index = this.giftCardProducts.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.giftCardProducts[index] = data;
        }
        this.editingGiftCardProduct = null;
      },
      'Failed to update gift card product'
    );
  }

  deleteGiftCardProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this gift card product?')) return;

    this.handleRequest(
      this.giftCardService.deleteGiftCardProduct(id),
      () => {
        this.giftCardProducts = this.giftCardProducts.filter(p => p.id !== id);
      },
      'Failed to delete gift card product'
    );
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
