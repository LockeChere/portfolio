import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Reservation } from '../models/reservation';
import { spaceDb, apiError } from '../demo/space-db';
import { DockService } from './dock.service';

// Demoversie: reserveringen worden gecontroleerd en opgeslagen in de browser.
@Injectable({ providedIn: 'root' })
export class ReservationService {
  private dockService = inject(DockService);

  createReservation(reservation: Reservation): Observable<any> {
    const email = spaceDb.currentEmail();
    if (!email) return throwError(() => apiError('Je moet ingelogd zijn', 401));
    const dock = spaceDb.docksWithState().find(d => d.id === reservation.dockId);
    const ship = spaceDb.ships.get().find(s => s.id === reservation.shipId && s.ownerEmail === email);
    const start = new Date(reservation.startTime), end = new Date(reservation.endTime);

    if (!dock) return throwError(() => apiError('Dock bestaat niet'));
    if (!ship) return throwError(() => apiError('Kies een van je eigen schepen'));
    if (dock.maintenance) return throwError(() => apiError('Dit dock is in onderhoud'));
    if (dock.dangerous) return throwError(() => apiError('Naast dit dock ligt een schip met gevaarlijke lading'));
    if (ship.size !== dock.size) return throwError(() => apiError(`Een ${ship.size} schip past niet in een ${dock.size} dock`));
    if (isNaN(+start) || isNaN(+end) || end <= start) return throwError(() => apiError('De eindtijd moet na de begintijd liggen'));

    const all = spaceDb.reservations.get();
    const overlaps = (r: { startTime: string; endTime: string }) => new Date(r.startTime) < end && new Date(r.endTime) > start;
    if (all.some(r => r.dockId === dock.id && overlaps(r))) return throwError(() => apiError('Dit dock is in die periode al gereserveerd'));
    if (all.some(r => r.shipId === ship.id && overlaps(r))) return throwError(() => apiError('Dit schip heeft in die periode al een reservering'));

    const created = { ...reservation, id: spaceDb.nextId(all), ownerEmail: email };
    all.push(created);
    spaceDb.reservations.set(all);
    this.dockService.refresh();
    return of(spaceDb.expand(created));
  }

  loadMyReservations(): Observable<any> {
    const email = spaceDb.currentEmail();
    return of(spaceDb.reservations.get().filter(r => r.ownerEmail === email).map(r => spaceDb.expand(r)));
  }

  getActiveReservationByDockId(dockId: number): Observable<any[]> {
    return of(spaceDb.reservations.get()
      .filter(r => r.dockId === dockId && spaceDb.isActive(r))
      .map(r => spaceDb.expand(r)));
  }
}
