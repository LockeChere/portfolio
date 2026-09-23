import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userService.getToken();

    if (token) {
      try {
        const payload = this.userService.decodeToken(token);
      } catch (e) {
        // Error decoding token
      }
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Response received for request
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.userService.logout();
        } else if (error.status === 403) {
          const role = this.userService.getRole();
        }
        throw error;
      })
    );
  }
} 