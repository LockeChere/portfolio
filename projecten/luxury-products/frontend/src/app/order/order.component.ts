import {Component, inject, signal} from '@angular/core';
import {OrderService} from '../services/order.service';
import {ShoppingCartService} from '../services/shopping-cart.service';
import {LoginService} from '../services/login.service';
import {Order} from '../models/Order';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {UserService} from '../services/user.service';
import {NgIf, NgFor} from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  private orderService = inject(OrderService);
  private cartService = inject(ShoppingCartService);
  private userService = inject(UserService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  isLoggedIn: boolean = false;

  constructor() {
    this.loginService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  protected orderForm = new FormGroup({
    "street": new FormControl("", [Validators.required]),
    "city": new FormControl("", [Validators.required]),
    "zip_code": new FormControl("", [Validators.required]),
  });

  protected submitOrder(): void {
    const userId = this.userService.getUserId();
    const userIdAsNumber = Number(userId);
    if (isNaN(userIdAsNumber)) {
      return;
    }

    const shippingAddress = `${this.orderForm.get('street')?.value} ${this.orderForm.get('city')?.value} ${this.orderForm.get('zip_code')?.value}`;

    this.orderService.createOrder(userIdAsNumber, shippingAddress).subscribe({
      next: (resData) => {
        this.cartService.clearCart();
        this.goToUser(resData.user.id);
      },
      error: (err) => {
        console.log('Error placing order', err);
      }
    });
  }

  private goToUser(userId: number): void {
    this.router.navigate(['/user/' + `${userId}`]);
  }
}
