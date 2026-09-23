import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Ship } from '../models/ship.model';
import { spaceDb } from '../demo/space-db';

// Demoversie: schepen van de ingelogde gebruiker, opgeslagen in de browser.
@Injectable({ providedIn: 'root' })
export class ShipService {

  addShip(ship: Ship): Observable<Ship> {
    const email = spaceDb.currentEmail();
    if (!email) return throwError(() => ({ status: 401 }));
    const ships = spaceDb.ships.get();
    const img = (ship.imgUrl || '').trim() || 'assets/images/ships/ship-fighter.svg';
    const typeId = String(ship.shipTypeId || '2');
    const created = {
      id: spaceDb.nextId(ships), ownerEmail: email, imgUrl: img, imageUrl: img,
      size: ship.size as any, carryingDangerous: !!ship.carryingDangerous, shipTypeId: typeId,
      shipType: { id: +typeId, type: typeId === '1' ? 'Militair' : 'Niet-militair' },
    };
    ships.push(created);
    spaceDb.ships.set(ships);
    return of(created as any);
  }

  loadMyShips(): Observable<any> {
    const email = spaceDb.currentEmail();
    return of(spaceDb.ships.get().filter(s => s.ownerEmail === email));
  }
}
