import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Product } from '../../common/product';
import { AuthService } from '../../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editingProduct: Product | null = null;
  showAdminActions: boolean = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router) {
    this.productForm = this.fb.group({
      name: [''],
      price: [''],
      imgUrl: [''],
      categoryId: [''],
      description: [''],
      available: [false],
      unitsInStock: [0],
    });
  }


  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProductsOnMain().subscribe(p => this.products = [...p]);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  toggleAdminActions(): void {
    this.showAdminActions = !this.showAdminActions;
  }

  addProduct(): void {
    if (!this.isAdmin) return; 

    const newProduct: Product = {
      id: this.products.length + 1,
      imgUrl: this.productForm.value.imgUrl,
      name: this.productForm.value.name,
      categoryId: +this.productForm.value.categoryId,
      description: this.productForm.value.description,
      price: +this.productForm.value.price,
      available: this.productForm.value.available,
      unitsInStock: this.productForm.value.unitsInStock
    };
    console.log('Product JSON:', JSON.stringify(newProduct));

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',  
      'Authorization': 'Bearer ' + this.authService.getToken()  
    });

    this.productService.addProduct(newProduct).subscribe(
      () => {
        console.log('Product added successfully');
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );


    this.loadProducts();
    this.productForm.reset({ available: false, unitsInStock: 0 });
  };

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.setValue({
      name: product.name,
      price: product.price,
      imgUrl: product.imgUrl,
      categoryId: product.categoryId || '',
      description: product.description,
      available: product.available,
      unitsInStock: product.unitsInStock,
    });
  }

  updateProduct(): void {
    if (!this.isAdmin) return; 
  
    if (this.editingProduct) {
      this.editingProduct.name = this.productForm.value.name;
      this.editingProduct.price = this.productForm.value.price;
      this.editingProduct.imgUrl = this.productForm.value.imgUrl;
      this.editingProduct.description = this.productForm.value.description;
      this.editingProduct.available = this.productForm.value.available;
      this.editingProduct.unitsInStock = this.productForm.value.unitsInStock;
  
      this.editingProduct.categoryId = +this.productForm.value.categoryId || this.editingProduct.categoryId;
      this.productService.updateProduct(this.editingProduct).subscribe(() => this.loadProducts());
      this.editingProduct = null;
      this.productForm.reset({ available: false, unitsInStock: 0 });
    }
  }

  deleteProduct(id: number): void {
    if (!this.isAdmin) return; 

    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }
  
}
