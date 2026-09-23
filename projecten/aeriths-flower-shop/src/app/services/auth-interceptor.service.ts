import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAcces(request, next));
  }

  private async handleAcces(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // const securedEndpoints = ['http://167.233.40.33:8081/api/order_history'];
    const securedEndpoints = ['http://167.233.40.33:8081/api/products'];
  
    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      const accesToken = this.authService.getToken();  // Zorg ervoor dat je getToken() methode correct de token haalt
  
      if (accesToken) {
        
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accesToken}`,
              'Content-Type': 'application/json'
            }
          });
          console.log("Request Headers:", request.headers);
      }
    }
  
    return await lastValueFrom(next.handle(request));
  }
  
}
