import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth-service.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AccessibilityComponent } from './components/accessibility/accessibility.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminGuardService } from './services/admin-guard-service.service';
import { ProductImgPipe } from './demo/product-img.pipe';
import { EditProductComponent } from './components/edit-product/edit-product.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');}

function sendToLoginPage(authService: AuthService, injector: Injector){

    const router = injector.get(Router);

    router.navigate(['/login']);
  }
  
  

const routes: Routes = [
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'product/edit/:id', component: EditProductComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuardService] },
  { path: 'products/create', component: AdminPanelComponent, canActivate: [AdminGuardService] },
  { path: 'products/:id/update', component: AdminPanelComponent, canActivate: [AdminGuardService] },
  { path: 'products/:id/delete', component: AdminPanelComponent, canActivate: [AdminGuardService] },


  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], 
    data: {onAuthRequired: sendToLoginPage}},
  {path: 'members', component: MembersPageComponent, canActivate: [AuthGuard], 
    data: {onAuthRequired: sendToLoginPage}},
  {path: 'logout', component: AppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    LoginComponent,
    CheckoutComponent,
    RegisterComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    AdminPanelComponent,
    EditProductComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    
    AccessibilityComponent,
    ProductImgPipe
],
  providers: [provideHttpClient(), ProductService,
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}], 
  bootstrap: [AppComponent]
})
export class AppModule { }

