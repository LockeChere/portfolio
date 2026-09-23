import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private userService = inject(UserService);

  private loggedInSubject = new BehaviorSubject<boolean>(this.userService.hasValidToken());
  public loggedIn$ = this.loggedInSubject.asObservable();

  public login(login: { email: string | null | undefined; password: string | null | undefined }): Observable<any> {
    // Mock JWT token (expires ver in de toekomst)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock';
    const isAdmin = login.email === 'admin@example.com';
    const mockResponse = {
      token: mockToken,
      userId: '1',
      role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER',
    };

    return of(mockResponse).pipe(
      tap(res => {
        this.userService.saveTokenInLocalStorage(res.token);
        localStorage.setItem('loggedInUserId', res.userId);
        this.userService.setRole(res.role);
        this.loggedInSubject.next(true);
      })
    );
  }
}
