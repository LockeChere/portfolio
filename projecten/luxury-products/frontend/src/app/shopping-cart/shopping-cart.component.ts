import { Component, inject } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  protected cartService = inject(ShoppingCartService);
  private toastrService = inject(ToastrService);

  cart = this.cartService.getCart();
  appliedGiftCard = this.cartService.getAppliedGiftCard();

  giftCardCode = new FormControl('');

  protected removeProduct(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.showSuccess("Product removed");
  }

  protected increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  protected decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  protected clearCart(): void {
    this.cartService.clearCart();
    this.showSuccess("Cart cleared");
  }

  protected getOptionsPrice(): number {
    return 0;
  }

  protected getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  protected getFinalPrice(): number {
    return this.cartService.getFinalPrice();
  }

  protected async applyGiftCard(): Promise<void> {
    const code = this.giftCardCode.value;
    if (!code) {
      this.showError('Please enter a gift card code');
      return;
    }

    const success = await this.cartService.applyGiftCard(code);
    if (success) {
      this.showSuccess('Gift card applied successfully');
      this.giftCardCode.reset();
    } else {
      this.showError('Invalid gift card code or gift card already used');
    }
  }

  protected removeGiftCard(): void {
    this.cartService.removeGiftCard();
    this.showSuccess('Gift card removed');
  }



  public showSuccess(message: string): void {
    this.toastrService.success(`<b>${message}</b>`, 'Success!', {
      toastClass: 'custom-toast-class',
      enableHtml: true,
    });
  }

  public showError(message: string): void {
    this.toastrService.error(`<b>${message}</b>`, 'Error!', {
      toastClass: 'custom-toast-class',
      enableHtml: true,
    });
  }
}
