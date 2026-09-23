import {computed, Injectable, Injector} from '@angular/core';
import { AuthService } from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authService.currentUser;
    const isAdmin = computed(() => this.authService.isAdminSignal());
    if (isAdmin()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
