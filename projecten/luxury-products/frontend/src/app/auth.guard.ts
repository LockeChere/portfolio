import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from './services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  // Check if the route requires admin access
  const requiresAdmin = route.data['requiresAdmin'] === true;

  // First check if user has a valid token
  if (!userService.hasValidToken()) {
    const userId = userService.getUserId();
    router.navigate([`/user/${userId || 'guest'}`], {
      queryParams: { notLoggedIn: true }
    });
    return false;
  }

  // If admin access is required, check if user is admin
  if (requiresAdmin && !userService.isAdmin()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url, adminRequired: true }
    });
    return false;
  }

  // User has necessary permissions
  return true;
};
