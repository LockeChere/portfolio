import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  product: Product = {} as Product;
  isAdmin: boolean = false;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService ){  }
 
  ngOnInit(): void{
    this.route.paramMap.subscribe(() => { 
      this.handleProductDetails();

    });

    this.isAdmin = this.authService.isAdmin;
    console.log('Is Admin:', this.isAdmin);

  }
  handleProductDetails() {
    //get id string convert to number
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.price}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

  deleteProduct() {
    if (this.product?.id) {
      this.productService.deleteProduct(this.product.id).subscribe(
        () => {
          alert('Product was removed!');
          this.router.navigate(['/products']); // Navigeer naar de productpagina
        },
        error => {
          console.error('Error during deletion of product', error);
        }
      );
    }
  }

  editProduct() {
    if (this.authService.isAdmin) {
      this.router.navigate(['/product/edit', this.product.id]);
    } else {
      console.log('You don`t have permission to edit a product');
    }
  }

}
