import { Component } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService){ }

  ngOnInit(): void {
    this.handleOrderHistory();
  }


  handleOrderHistory() {
    this.orderHistoryService.getOrderHistory().subscribe({
      next: data => {
        console.log("Contents of order history list: " + this.orderHistoryList);
        this.orderHistoryList = data;
      },
      error: err => {
        console.error("Error retrieving order history:", err);
      }
    });
}}
