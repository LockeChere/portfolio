import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loginService = inject(AuthService);
  const authToken = loginService.getToken;
  console.log("Intercepor " + authToken)

  if (authToken != null){
    const newRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
    console.log("New request")
    return next(newRequest);
  }

  return next(req);
}
