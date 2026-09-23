import { Injectable, signal } from '@angular/core';
import { Dock } from '../models/dock.model';
import { Observable, of, throwError } from 'rxjs';
import { spaceDb } from '../demo/space-db';

// Demoversie: dokken komen uit de in-browser demo-database (zie demo/space-db.ts).
@Injectable({ providedIn: 'root' })
export class DockService {
  private docks = signal<Dock[]>(spaceDb.docksWithState() as any);

  refresh(): void {
    this.docks.set(spaceDb.docksWithState() as any);
  }

  releaseDock(id: number): Observable<string> {
    const now = new Date();
    const reservations = spaceDb.reservations.get().map(r =>
      r.dockId === id && spaceDb.isActive(r, now) ? { ...r, endTime: now.toISOString().slice(0, 19) } : r);
    spaceDb.reservations.set(reservations);
    spaceDb.docks.set(spaceDb.docks.get().map(d => d.id === id ? { ...d, maintenance: false } : d));
    this.refresh();
    return of(`Dock ${id} is vrijgegeven`);
  }

  getAllDocks(): Observable<Dock[]> {
    this.refresh();
    return of(this.docks());
  }

  getDockById(theDockId: number): Observable<Dock> {
    const dock = this.docks().find(d => d.id === +theDockId);
    return dock ? of(dock) : throwError(() => ({ status: 404 }));
  }

  get getDocks() {
    return this.docks;
  }

  setDockToDangerous(dockId: number) {
    const dock = this.docks().find(d => d.id === dockId);
    if (!dock || dock.dangerous) return;
    this.docks.set(this.docks().map(d => d.id === dockId ? { ...d, dangerous: true } : d));
  }

  returnFilteredDocks(currentLevel: number) {
    return this.docks().filter(dock => dock.level === currentLevel);
  }

  setDockToMaintenance(id: number): Observable<string> {
    spaceDb.docks.set(spaceDb.docks.get().map(d => d.id === id ? { ...d, maintenance: true } : d));
    this.refresh();
    return of(`Dock ${id} staat nu in onderhoud`);
  }
}
