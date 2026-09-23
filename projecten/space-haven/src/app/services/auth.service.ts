import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { spaceDb } from '../demo/space-db';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  storage: Storage = localStorage;
  public currentUser = signal<User | null>(null);
  public isLoggedIn = signal(false);
  public isAdmin = signal(false);

  constructor(private router: Router) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.currentUser.set(parsedUser);
      this.isLoggedIn.set(true);
      this.isAdmin.set(parsedUser.role === 'ROLE_ADMIN');
    }
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    // Demoversie: controleert tegen de accounts in de browser.
    const u = spaceDb.users.get().find(x => x.email === (credentials.email || '').trim().toLowerCase() && x.password === credentials.password);
    if (!u) return throwError(() => ({ status: 401 }));
    return of({ email: u.email, token: 'demo-token-' + u.email, role: u.role, userFaction: u.userFaction });
  }

  register(user: any): Observable<any> {
    const users = spaceDb.users.get();
    const email = (user.email || '').trim().toLowerCase();
    if (!email || users.some(u => u.email === email)) return throwError(() => ({ status: 400 }));
    const factions = spaceDb.factions();
    users.push({ email, password: user.password, role: 'ROLE_USER', userFaction: factions[users.length % factions.length] });
    spaceDb.users.set(users);
    return of({ success: true });
  }

  updateUser(user: User): Observable<any> {
    return of(user);
  }

  saveUserToLocalStorage(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    this.isAdmin.set((user as any).role === 'ROLE_ADMIN');
  }

  checkRoleOnBackend(token?: string) {
    const user = this.currentUser();
    if (user) this.isAdmin.set((user as any).role === 'ROLE_ADMIN');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  get getToken() {
    return this.currentUser()?.token;
  }

  get isAdminSignal() {
    return this.isAdmin;
  }

  get userSignal() {
    return this.currentUser;
  }
}
