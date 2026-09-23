// account.component.ts
import {Component, computed, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import { Router } from '@angular/router';
import translate from 'translate';
import { ShipComponent } from '../ship/ship.component';
import { MyReservationComponent } from "../my-reservation/my-reservation.component";


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  imports: [
    NgIf,
    TranslatePipe,
    ShipComponent,
    MyReservationComponent
],
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  user = computed(() => this.authService.userSignal());
  protected isAdmin = computed(() => this.authService.isAdminSignal());

  constructor(private authService: AuthService,
              private router: Router
  ) {}


  activeTab: 'gegevens' | 'voertuigen' | 'reservaties' = 'gegevens';

  setActiveTab(tab: 'gegevens' | 'voertuigen' | 'reservaties') {
    this.activeTab = tab;
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToCreateShip(): void {
    this.router.navigate(['/create-ship']);
  }
}
