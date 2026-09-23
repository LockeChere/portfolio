import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { spaceDb } from '../demo/space-db';

export interface TotalPoints {
  points: number;
}

// Demoversie: 50 bonuspunten per reservering van de ingelogde gebruiker.
@Injectable({ providedIn: 'root' })
export class PointService {
  getTotal(): Observable<TotalPoints> {
    const email = spaceDb.currentEmail();
    return of({ points: spaceDb.reservations.get().filter(r => r.ownerEmail === email).length * 50 });
  }
}
