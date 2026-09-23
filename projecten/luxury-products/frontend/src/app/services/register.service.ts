import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResponseAuthData } from '../models/ResponseAuthData';
import { UserService } from './user.service';
import { demoDb } from '../demo/demo-db';

// Demoversie: registreren maakt een account aan in de browser (zelfde wachtwoordregels als de backend).
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private userService = inject(UserService);

  public register(registerData: { email: string | null | undefined; password: string | null | undefined }): Observable<ResponseAuthData> {
    const email = (registerData.email || '').trim().toLowerCase();
    const password = registerData.password || '';
    const strong = /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
    const users = demoDb.users.get();
    if (!email || !strong || users.some(u => u.email === email)) {
      return throwError(() => ({ status: 400 }));
    }
    const user = { id: demoDb.nextId(users), email, password, role: 'ROLE_USER' as const };
    users.push(user);
    demoDb.users.set(users);
    const res: ResponseAuthData = { userId: String(user.id), email, token: 'demo-token-' + user.id, role: user.role };
    return of(res).pipe(tap(r => this.userService.startSession(r)));
  }
}
