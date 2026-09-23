import { Component, inject, Input, OnInit, SimpleChanges} from '@angular/core';
import { Product } from '../../models/Product';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgClass} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [TranslateModule, NgClass],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;
  isAdmin = false;
  stockStatus: string = '';
  private cartService = inject(ShoppingCartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private toastrService = inject(ToastrService);
  private userService = inject(UserService);
  private translateService = inject(TranslateService);

  ngOnInit(): void {
    this.isAdmin = this.userService.hasValidToken() && this.userService.isAdmin();
    this.updateStockStatus();
  }

  private updateStockStatus(): void {
    if (this.isAdmin) {
      if (this.product.stock === 0) {
        this.translateService.get('product.out-of-stock').subscribe(status => {
          this.stockStatus = status;
        });
      } else if (this.product.stock <= 5) {
        this.translateService.get('product.low-stock').subscribe(status => {
          this.stockStatus = `${status}: ${this.product.stock}`;
        });
      } else {
        this.translateService.get('product.in-stock').subscribe(status => {
          this.stockStatus = `${status}: ${this.product.stock}`;
        });
      }
    } else {
      if (this.product.stock === 0) {
        this.translateService.get('product.out-of-stock').subscribe(status => {
          this.stockStatus = status;
        });
      } else if (this.product.stock <= 5) {
        this.translateService.get('product.low-stock').subscribe(status => {
          this.stockStatus = status;
        });
      } else {
        this.translateService.get('product.in-stock').subscribe(status => {
          this.stockStatus = status;
        });
      }
    }
  }

  protected addToCart(event: Event): void {
    event.stopPropagation();
    if (this.product.stock > 0) {
      this.cartService.addToCart(this.product);
      this.showSuccess('Product added successfully.');
    } else {
      this.toastrService.error('Product is out of stock', 'Error');
    }
  }

  protected goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId]);
  }

  protected showSuccess(message: string): void {
    this.toastrService.success(`<b>${message}</b>`, 'Success!', {
      toastClass: 'custom-toast-class',
      enableHtml: true,
    });
  }
}
