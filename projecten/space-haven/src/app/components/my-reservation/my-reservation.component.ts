import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-my-reservation',
  imports: [TranslateModule, CommonModule],
  templateUrl: './my-reservation.component.html',
  styleUrl: './my-reservation.component.scss'
})
export class MyReservationComponent {
  reservations: any[] = [];
  activeReservations: any[] = [];
  pastReservations: any[] = [];
  user: any = {};

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.loadMyReservations().subscribe(
      (data) => {
        this.reservations = data;

        const now = new Date();

        this.activeReservations = this.reservations.filter(res =>
          new Date(res.endTime) > now
        );

        this.pastReservations = this.reservations.filter(res =>
          new Date(res.endTime) <= now
        );
      },
      (error) => {
        console.error('Error while retrieving reservations:', error);
      }
    );
  }
}