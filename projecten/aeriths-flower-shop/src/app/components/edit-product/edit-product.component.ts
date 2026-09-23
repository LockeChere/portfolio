import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product: Product = {} as Product;
  productForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
        this.productForm = new FormGroup({
          name: new FormControl(this.product.name, [Validators.required]),
          transDescription: new FormControl(this.product.transDescription, [Validators.required]),
          price: new FormControl(this.product.price, [Validators.required, Validators.min(0)])
        });
      },
      error => {
        console.error('Er is een fout opgetreden bij het ophalen van het product:', error);
        this.router.navigate(['/']);
      }
    );
  }

  saveProduct() {
    if (this.authService.isAdmin) {
      const updatedProduct = { ...this.productForm.value, id: this.product.id }; // Zorg ervoor dat het id wordt meegegeven
  
      this.productService.updateProduct(updatedProduct).subscribe(
        (response) => {
          console.log('Product succesvol bijgewerkt!', response);
          alert('Product succesvol bijgewerkt!'); // Melding voor de gebruiker
          this.router.navigate(['/products']); // Terug naar de lijst van producten
        },
        (error) => {
          console.error('Er is een fout opgetreden bij het bijwerken van het product:', error);
          alert('Er is een fout opgetreden bij het bijwerken van het product.');
        }
      );
    } else {
      console.log('Je hebt geen toestemming om dit product bij te werken');
      alert('Je hebt geen toestemming om dit product bij te werken.');
    }
  }
  
  cancel() {
    this.router.navigate(['/products']); 
  }
  


  
}
