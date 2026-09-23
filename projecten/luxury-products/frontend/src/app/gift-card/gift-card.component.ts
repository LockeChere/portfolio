// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { GiftCardService } from '../services/gift-card.service';
// import { GiftCard } from '../models/GiftCard';

// @Component({
//   standalone: true,
//   selector: 'app-gift-card',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './gift-card.component.html'
// })
// export class GiftCardComponent implements OnInit {
//   giftCards: GiftCard[] = [];
//   newValue = 0;
//   productId?: number;
//   redeemId?: number;
//   updateId?: number;
//   updateValue?: number;
//   updateUsed?: boolean;
//   message = '';

//   constructor(private giftCardService: GiftCardService) {}

//   ngOnInit() {
//     this.loadCards();
//   }

//   // loadCards() {
//   //   this.giftCardService.getAll().subscribe(data => this.giftCards = data);
//   // }


//   redeemCard() {
//     if (!this.redeemId) return;
//     this.giftCardService.redeem(this.redeemId).subscribe({
//       next: (msg) => {
//         this.message = msg;
//         this.loadCards();
//       },
//       error: () => this.message = 'Giftcard ongeldig of al gebruikt.'
//     });
//   }

//   // updateCard() {
//   //   if (!this.updateId) return;
//   //   this.giftCardService.update(this.updateId, this.updateValue, this.updateUsed).subscribe({
//   //     next: () => {
//   //       this.message = 'Giftcard bijgewerkt.';
//   //       this.loadCards();
//   //     },
//   //     error: () => this.message = 'Bijwerken mislukt.'
//   //   });
//   // }

  
//   // createCard() {
//   //   this.giftCardService.create(this.newValue, this.productId).subscribe({
//   //     next: () => {
//   //       this.message = 'Giftcard aangemaakt!';
//   //       this.loadCards();
//   //     },
//   //     error: () => this.message = 'Aanmaken mislukt.'
//   //   });
//   // }
// }
