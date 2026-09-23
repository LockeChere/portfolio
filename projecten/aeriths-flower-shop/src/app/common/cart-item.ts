import { Product } from "./product";

export class CartItem {
    id: number;
    name: string;
    imgUrl: string;
    price: number;
    quantity: number;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imgUrl = product.imgUrl;
        this.price = product.price;
        this.quantity = 1;
    }
}
