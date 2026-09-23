import {CanMatchFn, RedirectCommand, Router, Routes} from '@angular/router';
import {AccessibilityComponent} from './components/accessibility/accessibility.component';
import {HangarComponent} from './components/hangar/hangar.component';
import {LoginComponent} from './components/login/login.component';
import {inject, Injector} from '@angular/core';
import {AuthService} from './services/auth.service';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './services/auth-guard.service';
import {AccountComponent} from './components/account/account.component';
import {AdminGuard} from './services/admin-guard.service';
import { CreateShipComponent } from './components/create-ship/create-ship.component';
import { MakeReservationComponent } from './components/make-reservation/make-reservation.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminReservationControlComponent } from './components/admin-reservation-control/admin-reservation-control.component';
import { DockInfoComponent } from './components/dock-info/dock-info.component';
// import {RegisterComponent} from './components/register/register.component';

const canAccesLogin: CanMatchFn =(route, segments) => {
  const router = inject(Router)
  const loginService = inject(AuthService);
  if (!loginService.isLoggedIn()){
    return true;
  }
  return new RedirectCommand(router.parseUrl(""));
}

function sendToLoginPage(authService: AuthService, injector: Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']);
}

export const routes: Routes = [
  { path: 'dock-information', component: DockInfoComponent, canActivate: [AdminGuard] },
  { path: 'manage-reservations', component: AdminReservationControlComponent, canActivate: [AdminGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'create-ship', component: CreateShipComponent },
  {
    path: 'make-reservation',
    component: MakeReservationComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '', component: HangarComponent
  },
  {
    path: 'accessiblity-test', component: AccessibilityComponent
  },
  {
    path: 'login', canActivate: [canAccesLogin], component: LoginComponent
  },
  {
    path: 'account', component: AccountComponent
  }
  // {
  //   path: 'register', component: RegisterComponent
  // }
];
