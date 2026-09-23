import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Reservation } from '../../models/reservation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-reservation-control',
  imports: [TranslateModule],
  templateUrl: './admin-reservation-control.component.html',
  styleUrl: './admin-reservation-control.component.scss'
})
export class AdminReservationControlComponent {
  protected allReservations: Reservation[] = [];
  constructor(private http: HttpClient, private adminService: AdminService) {
  }

  ngOnInit() {
    this.adminService.getAllReservationsSubscription().subscribe({
      next: (resData) => {
        this.allReservations = resData;
        console.log(this.allReservations);
      }
    });
  }

  deleteReservation(id: number) {
    for (let i = 0; i < this.allReservations.length; i++) {
      if (this.allReservations[i].id === id) {
        this.adminService.deleteReservation(id).subscribe({
          next: (resData) => {
            this.allReservations.splice(i, 1);
          }
        });

        console.log("Reservation deleted successfully");
        return;
      }
    }

    console.log("Could not delete reservation");
  }

}
