import { Routes } from '@angular/router';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {HomepageComponent} from './homepage/homepage.component';
import {ProductListComponent} from './product-list/product-list.component';
import {OrderComponent} from './order/order.component';
import {LoginComponent} from './authentication/login/login.component';
import {RegisterComponent} from './authentication/register/register.component';
import {ProductDetailsComponent} from './product-list/product-details/product-details.component';
import {UserComponent} from './user/user.component';
import {authGuard} from './auth.guard';
import {adminGuard} from './admin.guard';
import {AdminComponent} from './admin/admin.component';
import {GiftcardAdminComponent} from './admin/giftcard-admin/giftcard-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'cart',
    component: ShoppingCartComponent
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'products/:productId',
    component: ProductDetailsComponent,
  },
  {
    path: 'user/:userId',
    component: UserComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/giftcards',
    component: GiftcardAdminComponent,
    canActivate: [adminGuard]
  }
];
