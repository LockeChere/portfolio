import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private router: Router) {
    const userData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(userData ? JSON.parse(userData) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(map(user => !!user));
  }

  register(user: any): Observable<any> {
    return of({ success: true });
  }

  login(credentials: any): Observable<any> {
    const isAdmin = credentials.email === 'admin@example.com';
    const mockUser = {
      email: credentials.email,
      token: 'mock-jwt-token-' + Date.now(),
      role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authToken', mockUser.token);
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUserEmail(): string | null {
    return this.currentUserSubject.value?.email || null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ROLE_ADMIN';
  }
}
