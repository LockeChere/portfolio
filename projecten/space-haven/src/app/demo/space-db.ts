/**
 * In-browser "backend" voor de GitHub Pages-demo van Space Haven.
 * Vervangt de Spring Boot-API: gebruikers, schepen, dokken en reserveringen staan in localStorage.
 */
import { DemoStore } from './demo-store';

export type Size = 'SMALL' | 'MEDIUM' | 'LARGE';
export interface DemoUser { email: string; password: string; role: 'ROLE_USER' | 'ROLE_ADMIN'; userFaction: { id: number; name: string }; }
export interface DemoShip { id: number; ownerEmail: string; imgUrl: string; imageUrl: string; size: Size; carryingDangerous: boolean; shipTypeId: string; shipType: { id: number; type: string }; }
export interface DemoDock { id: number; size: Size; level: number; maintenance: boolean; }
export interface DemoReservation { id: number; shipId: number; dockId: number; startTime: string; endTime: string; ownerEmail: string; }

const FACTIONS = [{ id: 1, name: 'Celestria' }, { id: 2, name: 'Nautilus' }, { id: 3, name: 'Orion Guild' }];
const SHIP_TYPES: Record<string, string> = { '1': 'Militair', '2': 'Niet-militair' };

function iso(offsetHours: number): string {
  const d = new Date(Date.now() + offsetHours * 3600_000);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

function ship(id: number, ownerEmail: string, img: string, size: Size, dangerous: boolean, typeId: string): DemoShip {
  return { id, ownerEmail, imgUrl: img, imageUrl: img, size, carryingDangerous: dangerous, shipTypeId: typeId, shipType: { id: +typeId, type: SHIP_TYPES[typeId] } };
}

const sizes: Size[] = ['SMALL', 'MEDIUM', 'LARGE', 'SMALL', 'MEDIUM', 'LARGE', 'MEDIUM', 'SMALL'];

class SpaceDb {
  users = new DemoStore<DemoUser[]>('space-users', () => [
    { email: 'admin@haven.nl', password: 'Admin123!', role: 'ROLE_ADMIN', userFaction: FACTIONS[0] },
    { email: 'user@haven.nl', password: 'User123!', role: 'ROLE_USER', userFaction: FACTIONS[1] },
  ]);

  ships = new DemoStore<DemoShip[]>('space-ships', () => [
    ship(1, 'user@haven.nl', 'assets/images/ships/ship-fighter.svg', 'SMALL', false, '1'),
    ship(2, 'user@haven.nl', 'assets/images/ships/ship-cargo.svg', 'LARGE', true, '2'),
    ship(3, 'user@haven.nl', 'assets/images/ships/ship-cruiser.svg', 'MEDIUM', false, '2'),
    ship(4, 'admin@haven.nl', 'assets/images/ships/ship-cruiser.svg', 'MEDIUM', false, '1'),
    ship(5, 'admin@haven.nl', 'assets/images/ships/ship-fighter.svg', 'SMALL', false, '1'),
  ]);

  docks = new DemoStore<DemoDock[]>('space-docks', () => {
    const list: DemoDock[] = [];
    for (let level = 1; level <= 2; level++) {
      sizes.forEach((size, i) => list.push({ id: (level - 1) * sizes.length + i + 1, size, level, maintenance: level === 1 && i === 5 }));
    }
    return list;
  });

  reservations = new DemoStore<DemoReservation[]>('space-reservations', () => [
    { id: 1, shipId: 4, dockId: 2, startTime: iso(-2), endTime: iso(30), ownerEmail: 'admin@haven.nl' },
    { id: 2, shipId: 3, dockId: 11, startTime: iso(-1), endTime: iso(48), ownerEmail: 'user@haven.nl' },
    { id: 3, shipId: 1, dockId: 4, startTime: iso(-72), endTime: iso(-50), ownerEmail: 'user@haven.nl' },
  ]);

  factions() { return FACTIONS; }

  nextId(list: { id: number }[]): number { return Math.max(0, ...list.map(x => x.id)) + 1; }

  currentEmail(): string | null {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null')?.email ?? null; } catch { return null; }
  }

  isActive(r: DemoReservation, now = new Date()): boolean {
    return new Date(r.endTime) > now;
  }

  /** Reservering met ship- en dock-object erbij, zoals de backend die teruggaf. */
  expand(r: DemoReservation) {
    return {
      ...r,
      ship: this.ships.get().find(s => s.id === r.shipId) ?? null,
      dock: this.docks.get().find(d => d.id === r.dockId) ?? null,
    };
  }

  /** Dokken inclusief huidige reservering en schip (afgeleid uit actieve reserveringen). */
  docksWithState() {
    const reservations = this.reservations.get().filter(r => this.isActive(r));
    const ships = this.ships.get();
    const docks = this.docks.get().map(d => {
      const res = reservations.find(r => r.dockId === d.id) ?? null;
      const shipObj = res ? ships.find(s => s.id === res.shipId) ?? null : null;
      return { ...d, dangerous: false, currentReservation: res, currentShip: shipObj };
    });
    // Naast een schip met gevaarlijke lading mag niet worden aangemeerd.
    for (const d of docks) {
      if (d.currentShip?.carryingDangerous) {
        docks.filter(n => n.level === d.level && Math.abs(n.id - d.id) === 1 && !n.currentReservation)
          .forEach(n => n.dangerous = true);
      }
    }
    return docks;
  }
}

export const spaceDb = new SpaceDb();

export function apiError(message: string, status = 400) {
  return { status, error: { message }, message };
}
