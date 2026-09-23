import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Gebruik de isLoggedIn observable van AuthService om te controleren of de gebruiker is ingelogd
    return this.authService.isLoggedIn.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          // Gebruiker is ingelogd, geef toegang tot de route
          return true;
        } else {
          // Gebruiker is niet ingelogd, stuur ze door naar de loginpagina
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
