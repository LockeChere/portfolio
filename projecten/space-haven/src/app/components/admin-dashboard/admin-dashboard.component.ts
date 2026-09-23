import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminService} from '../../services/admin.service';
import {Reservation} from '../../models/reservation';
import {TranslatePipe} from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    TranslatePipe
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  allReservations: any[] = [];  
  constructor(private router: Router){}

  manageReservations() {
    console.log('Reserveringen beheren');
    this.router.navigate(['/manage-reservations']);
  }

  manageDocks() {
    console.log('Docks beheren');
    this.router.navigate(['/dock-information']);
  }


}
