import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { TranslateProductService } from '../../services/translate-product.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.scss',
})


export class ProductListComponent {
  selectedLanguage: string = 'en';
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/products`
  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private translateProductService: TranslateProductService
  ) {}

  ngOnInit() {
    // Demoversie: na het laden van de vertalingen de lijst opnieuw ophalen voor de huidige route
    // (categorie of zoekopdracht), zodat het filter niet wordt overschreven door alle producten.
    this.translateProductService.loadTranslations(this.selectedLanguage).subscribe(() => {
      this.listProducts();
    });

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // this.loadProducts();
    
  }
  

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => {
        this.products = data;
      });
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.price}`)
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }

  loadProducts(): void {
    this.productService.getProductsOnMain().subscribe((products) => {
      this.products = products.map((product) => {
        const productIdAsString = product.id.toString();  // Zorg ervoor dat je de id naar string converteert
  
        // Verkrijg vertaling voor productnaam en beschrijving
        product.transName = this.translateProductService.translate(productIdAsString);
        product.transDescription = this.translateProductService.translateDescription(productIdAsString);
        return product;
      });
    });
  }
}

  // loadProducts(): void {
  //   const language = 'en';  // of een dynamisch gegenereerde taal, bijvoorbeeld van een gebruikersvoorkeur
  
  //   this.productService.getProductsOnMain().subscribe((products) => {
  //     this.products = [];
  
  //     products.forEach((product) => {
  //       // Zorg ervoor dat de id een string is
  //       const productIdAsString = product.id.toString();
  
  //       // Verkrijg vertaling voor elk product
  //       this.translateProductService.getProductTranslation(productIdAsString, language).subscribe((translatedProduct) => {
  //         product.transName = translatedProduct.name;
  //         product.transDescription = translatedProduct.description;
  
  //         this.products.push(product);
  //       });
  //     });
  //   });

  
