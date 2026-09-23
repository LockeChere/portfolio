import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CustomUser } from '../models/CustomUser';
import { User } from '../models/User';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseAuthData } from '../models/ResponseAuthData';
import { demoDb } from '../demo/demo-db';

@Injectable({ providedIn: 'root' })
export class UserService {
  private authTokenKey = 'authToken';
  private roleKey = 'role';
  private userIdKey = 'loggedInUserId';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());

  private get mockUsers(): User[] {
    return demoDb.users.get().map(u => ({ id: u.id, email: u.email, firstName: '', lastName: '', phone: '', address: '', role: u.role }));
  }

  constructor() {}

  public getUserById(id: string | number): Observable<CustomUser> {
    const user = this.mockUsers.find(u => u.id === +id);
    if (!user) return throwError(() => ({ status: 404 }));
    return of({ id: user.id, email: user.email, role: user.role });
  }

  public getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  public isAdmin(): boolean {
    return localStorage.getItem(this.roleKey) === 'ROLE_ADMIN';
  }

  public getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  public getIsAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  public setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
    this.isAdminSubject.next(role === 'ROLE_ADMIN');
  }

  public getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  public logout(): void {
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.authTokenKey);
    this.loggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  public clearToken(): void {
    localStorage.removeItem(this.authTokenKey);
    this.loggedInSubject.next(false);
  }

  public hasValidToken(): boolean {
    return localStorage.getItem(this.authTokenKey) !== null;
  }

  public saveTokenInLocalStorage(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  /** Demoversie van POST /auth/login: controleert tegen de accounts in de browser. */
  public login(email: string, password: string): Observable<any> {
    const user = demoDb.users.get().find(u => u.email === (email || '').trim().toLowerCase() && u.password === password);
    if (!user) return throwError(() => ({ status: 401 }));
    const res: ResponseAuthData = { userId: String(user.id), email: user.email, token: 'demo-token-' + user.id, role: user.role };
    return of(res).pipe(tap(r => this.startSession(r)));
  }

  public startSession(res: ResponseAuthData): void {
    this.saveTokenInLocalStorage(res.token);
    localStorage.setItem(this.userIdKey, res.userId);
    this.setRole(res.role);
    this.loggedInSubject.next(true);
  }

  public decodeToken(token: string): any {
    return null;
  }

  public debugToken(): void {}

  getAllUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return of(this.mockUsers[0]);
  }

  deleteUser(userId: number): Observable<void> {
    return of(void 0);
  }
}
