import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AerithsFlowerShopFormService } from '../../services/aeriths-flower-shop-form.service';
import { AerithsFlowerShopValidators } from '../../validators/aeriths-flower-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;
  storage: Storage = sessionStorage;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private aerithFlowerShopService: AerithsFlowerShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router,
              private authService: AuthService){}

  ngOnInit(): void{

    this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                [Validators.required, Validators.minLength(2), 
                                AerithsFlowerShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                                [Validators.required, Validators.minLength(2),
                                  AerithsFlowerShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
                                [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    AerithsFlowerShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    //populate cc months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.aerithFlowerShopService.getCreditCardMoths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate cc years
    this.aerithFlowerShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    
  }
  reviewCartDetails() {
    //subscribe to cartservice quantity 
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );


    //subscribe to cartservice price
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}


  ShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement | null;

    if (checkbox && checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
      
  }

  
  onSubmit(){
    console.log("Handling form submission");

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderitems from cartitems
    // let orderItems: OrderItem[] = [];
    // for (let i=0; i < cartItems.length; i++){
    //   orderItems[i] =new OrderItem(cartItems[i]);
    // }
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    //populate purchase shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    //populate purchase billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    //populate purchase order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call rest api via the checkoutservice
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`)
        
        //reset cart
        this.resetCart();

      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutFormGroup.reset();

    //navigate back to main page
    this.router.navigateByUrl("/products");
  }
  
  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year = selected year

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.aerithFlowerShopService.getCreditCardMoths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

 

}
