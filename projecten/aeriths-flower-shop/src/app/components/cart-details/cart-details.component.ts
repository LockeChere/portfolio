import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService){}

  ngOnInit(): void{
    this.listCartDetails();
  }
  listCartDetails() {
    //get a handle to cartitems
    this.cartItems = this.cartService.cartItems;
    //subsicribe to totalprice cart
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    //subscribe to quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    //compute cart total price quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem)
  }

  remove(theCartItem: CartItem){
    this.cartService.remove(theCartItem);
  }

}
