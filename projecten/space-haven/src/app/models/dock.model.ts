import {Reservation} from './reservation';
import {Ship} from './ship.model';

export interface Dock {
  level: number;
  id: number;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  currentReservation: Reservation | null;
  currentShip: Ship | null;
  maintenance: boolean;
  dangerous: boolean;
}
