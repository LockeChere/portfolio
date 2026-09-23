import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CustomUser} from '../models/CustomUser';
import {NgFor, NgIf} from '@angular/common';
import {OrderService} from '../services/order.service';
import {Order} from '../models/Order';
import {TranslatePipe} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {GiftCardService} from '../services/gift-card.service';
import {GiftCard} from '../models/GiftCard';

/**
 * Component voor het weergeven en beheren van gebruikersgegevens en bestellingen
 * Toont gebruikersinformatie en een lijst van bestellingen
 */
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf, TranslatePipe, NgFor, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: CustomUser | null = null;
  error: string | null = null;

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private giftCardService = inject(GiftCardService);

  userOrders = signal<Order[]>([]);
  giftCardBalances = new Map<string, number>();
  orders: Order[] = [];

  /**
   * Initialiseert de component en laadt de bestellingen van de gebruiker
   */
  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = +params['userId'];
      if (!isNaN(userId)) {
        this.loadUser(userId);
        this.loadOrdersByUserId();
      } else {
        console.error("Not logged in");
      }
    });
  }

  private loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user: CustomUser) => {
        this.user = user;
      },
      error: (error: Error) => {
        console.error("Error loading product:", error);
      }
    });
  }

  /**
   * Laadt alle bestellingen van de huidige gebruiker
   */
  protected loadOrdersByUserId(): void {
    const userId = this.userService.getUserId();

    if (!userId) {
      console.log('No user ID found');
      return;
    }

    console.log('Loading orders for user ID:', userId);
    this.error = null;
    this.orderService.fetchOrdersByUserId(userId).subscribe({
      next: (orders: Order[]) => {
        console.log('Full orders data:', JSON.stringify(orders, null, 2));
        this.userOrders.set(orders);
        this.loadGiftCardBalances(orders);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
          this.userService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.error = 'You do not have permission to view these orders.';
        } else {
          this.error = 'An error occurred while loading your orders. Please try again later.';
        }
      }
    });
  }


  /**
   * Toont een succesmelding aan de gebruiker
   * @param message Het bericht dat getoond moet worden
   */
  private showSuccess(message: string): void {
    this.toastrService.success(message, 'Success!');
  }

  /**
   * Toont een foutmelding aan de gebruiker
   * @param message Het foutbericht dat getoond moet worden
   */
  private showError(message: string): void {
    this.toastrService.error(message, 'Error!');
  }

  /**
   * Geeft de lijst van bestellingen terug
   * @returns Array van bestellingen
   */
  getUserOrders(): Order[] {
    return this.userOrders();
  }

  goToUser(userId: string | null): void {
    if (!userId) {
      const token = this.userService.getToken();
      const role = this.userService.getRole();
      return;
    }
    this.router.navigate(['/user', userId]);
  }

copySuccess = false;

copyToClipboard(code: string): void {
  navigator.clipboard.writeText(code).then(() => {
    this.copySuccess = true;
    setTimeout(() => {
      this.copySuccess = false;
    }, 2000); 
  });
}

loadGiftCardBalances(orders: Order[]): void {
  // Clear previous balances
  this.giftCardBalances.clear();

  // Iterate through all orders and their items
  for (const order of orders) {
    for (const item of order.orderItems) {
      // Check if the item has a gift card code
      if (item.giftCardCode) {
        // Split the gift card codes (they might be comma-separated)
        const codes = item.giftCardCode.split(',');

        // Fetch balance for each code
        for (const code of codes) {
          if (code.trim()) {
            this.giftCardService.getByCode(code.trim()).subscribe({
              next: (giftCard: GiftCard) => {
                this.giftCardBalances.set(code.trim(), giftCard.balance);
              },
              error: (error) => {
                console.error(`Error fetching gift card balance for code ${code}:`, error);
              }
            });
          }
        }
      }
    }
  }
}

getGiftCardBalance(code: string): number | null {
  return this.giftCardBalances.has(code.trim()) ? this.giftCardBalances.get(code.trim()) ?? null : null;
}

}
