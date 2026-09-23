import { CartItem } from "./cart-item";

export class OrderItem {
        imgUrl?: string;
        price?: number;
        quantity?: number;
        productId?: number;

        constructor(cartItem: CartItem){
            this.imgUrl = cartItem.imgUrl;
            this.quantity = cartItem.quantity;
            this.price = cartItem.price;
            this.productId = cartItem.id;
        }
}
