import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, NgClass, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isAdmin = false;
  stockStatus: string = '';
  public totalPrice: number = 0;

  private cartService = inject(ShoppingCartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private toastrService = inject(ToastrService);
  private userService = inject(UserService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    this.isAdmin = this.userService.hasValidToken() && this.userService.isAdmin();
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (product: Product) => {
          this.product = product;
          this.updateStockStatus();
          this.updateTotalPrice();
        },
        error: (error: any) => {
          console.error('Error loading product:', error);
        }
      });
    }
  }

  private updateStockStatus(): void {
    if (!this.product) return;
    if (this.isAdmin) {
      if (this.product.stock === 0) {
        this.translateService.get('product.out-of-stock').subscribe(status => {
          this.stockStatus = status;
        });
      } else if (this.product.stock <= 5) {
        this.translateService.get('product.low-stock').subscribe(status => {
          this.stockStatus = `${status}: ${this.product!.stock}`;
        });
      } else {
        this.translateService.get('product.in-stock').subscribe(status => {
          this.stockStatus = `${status}: ${this.product!.stock}`;
        });
      }
    }
  }

  private updateTotalPrice(): void {
    if (!this.product) {
      this.totalPrice = 0;
      return;
    }
    this.totalPrice = this.product.price;
  }

  public getTotalPrice(): number {
    if (!this.product) return 0;
    return this.product.price;
  }

  addToCart(): void {
    if (this.product && this.product.stock > 0) {
      this.cartService.addToCart(this.product);
      this.showSuccess('Product added successfully!');
    } else {
      this.toastrService.error('Product is out of stock', 'Error');
    }
  }

  showSuccess(message: string): void {
    this.toastrService.success(`<b>${message}</b>`, 'Success!', {
      toastClass: 'custom-toast-class',
      enableHtml: true,
    });
  }
}
