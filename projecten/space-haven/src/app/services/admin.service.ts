import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../models/reservation';
import { spaceDb } from '../demo/space-db';
import { DockService } from './dock.service';

// Demoversie: admin-acties op de in-browser demo-database.
@Injectable({ providedIn: 'root' })
export class AdminService {
  private dockService = inject(DockService);

  getAllReservationsSubscription(): Observable<Reservation[]> {
    return of(spaceDb.reservations.get().map(r => ({ ...r, endTime: new Date(r.endTime).toLocaleString('nl-NL') })));
  }

  deleteReservation(id: number): Observable<string> {
    spaceDb.reservations.set(spaceDb.reservations.get().filter(r => r.id !== id));
    this.dockService.refresh();
    return of('Reservering verwijderd');
  }
}
