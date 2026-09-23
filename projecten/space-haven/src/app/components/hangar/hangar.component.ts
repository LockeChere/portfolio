import {Component, effect, inject, OnInit} from '@angular/core';
import {DockService} from '../../services/dock.service';
import {NgIf, NgStyle} from '@angular/common';
import {Dock} from '../../models/dock.model';
import {NavigationEnd, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import translate from 'translate';
import {Reservation} from '../../models/reservation';
import {ReservationService} from '../../services/reservation.service';
import {AuthService} from '../../services/auth.service';
import {filter} from 'rxjs';
import {PointService} from '../../services/point.service';


@Component({
  selector: 'app-hangar',
  imports: [
    NgStyle,
    TranslatePipe,
    NgIf,
  ],
  templateUrl: './hangar.component.html',
  styleUrl: './hangar.component.scss'
})
export class HangarComponent implements OnInit {
  private dockService = inject(DockService)
  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private pointService = inject(PointService);
  protected docksSignal = this.dockService.getDocks;
  protected authService = inject(AuthService);
  protected docks: Dock[] = [];

  selectedReservation: Reservation | null = null;
  showReservationDetails = false;
  currentLevel: number = 1;

  points = 1;


  constructor() {
    effect(() => {
      const docks = this.docksSignal();

      if (docks.length > 0) {
        this.loadReservationsOnce(docks); // One-time setup
      }
    });
  }

  private loadReservationsOnce(docks: Dock[]) {
    this.docks = docks;

    for (const dock of this.docks) {
      this.reservationService.getActiveReservationByDockId(dock.id).subscribe({
        next: (resData) => {
          if (resData.length > 0) {
            dock.currentReservation = resData[0];
            if (dock.currentShip?.carryingDangerous) {
              this.dockService.setDockToDangerous(dock.id + 1);
              this.dockService.setDockToDangerous(dock.id - 1);
            }
          }
        }
      });
    }

    console.log('Docks loaded:', this.docks);
  }

  ngOnInit(): void {
  this.updatePoints();
      this.router.events.pipe(
          filter(evt => evt instanceof NavigationEnd && this.router.url.endsWith('/hangar'))
        ).subscribe(() => this.updatePoints());
  }

  private updatePoints(): void {
    this.pointService.getTotal().subscribe({
        next: totalPoints => this.points = totalPoints.points,
      error: error => console.error('Kon punten niet ophalen', error)
    });
  }

  reserveDock(dockId: number) {
    const dock = this.docks.find(dock => dock.id === dockId);

    if (!dock) {
      console.error(`Dock met id ${dockId} niet gevonden.`);
      return;
    }
    if (dock?.currentReservation !== null) {
      this.reservationService.getActiveReservationByDockId(dock.id)
        .subscribe(reservationList => {
          console.log('reservationList:', reservationList);
          const reservation = reservationList.find(
            (res: any) => res.dock.id === dockId
          );
          if (reservation) {
            this.selectedReservation = reservation;
            this.showReservationDetails = true;
          } else {
            console.log("Reservation not found.");
            this.router.navigate(['/make-reservation'], { queryParams: { dockId } });
          }
        });
    } else {
      console.log("dock not found.");
      this.router.navigate(['/make-reservation'], { queryParams: { dockId } });
    }
  }

  reserveDockPopUp() {
    if (!this.selectedReservation) { return; }
    const dockId = this.selectedReservation.id;
    this.router.navigate(['/make-reservation'], { queryParams: { dockId } });
  }
  closeDetails() {
    this.showReservationDetails = false;
    this.selectedReservation = null;
  }


  getItemStyle(index: number, totalItems: number) { // gets the angle of the rotation
    const angle = (360 / totalItems) * index;
    return {
      transform: `
      translate(-50%, -50%)
      rotate(${angle}deg)
      translateX(20rem)
      rotate(${-angle}deg)
    `,
      transformOrigin: 'center'
    };
  }

  get filteredDocks() {
    return this.dockService.returnFilteredDocks(this.currentLevel);
  }

  switchLevel(level: number): void {
    this.currentLevel = level;
  }

  protected readonly translate = translate;
}
