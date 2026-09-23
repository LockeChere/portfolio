import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChewbaccaArmyValidator } from '../../validators/chewbacca-army-validator';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ShipService } from '../../services/ship.service';
import { DockService } from '../../services/dock.service';
import Swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-make-reservation',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './make-reservation.component.html',
  styleUrl: './make-reservation.component.scss',
})
export class MakeReservationComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  userShips: any[] = [];
  selectedDockSize: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private shipService: ShipService,
    private activatedRoute: ActivatedRoute,
    private dockService: DockService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        email: new FormControl(this.authService.userSignal()?.email, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      reservation: this.formBuilder.group({
        shipId: new FormControl(null),
        dockId: new FormControl(null),
        startTime: new FormControl(''),
        endTime: new FormControl(''),
      }),
    });
    this.activatedRoute.queryParams.subscribe(params => {
      const dockId = params['dockId'];
      this.loadDockSize(dockId);
      this.checkoutFormGroup.get('reservation.dockId')?.setValue(Number(dockId));
    });
    this.loadUserShips();


  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  loadDockSize(dockId: number): void {
    this.dockService.getDockById(dockId).subscribe({
      next: (dock) => {
        this.selectedDockSize = dock.size;
      },
      error: (err) => {
        console.error('Fout bij ophalen dock:', err);
      }
    });
  }

  hasReservedNeighborDocks(): boolean {
    let dockId = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      dockId = Number(params['dockId']);
    });
    const allDocks = this.dockService.getDocks();
    const currentDock = allDocks.find(d => d.id === dockId);

    if (!currentDock) {
      console.warn(`Dock with ID ${dockId} not found.`);
      return false;
    }

    const neighbors = allDocks.filter(dock =>
      dock.level === currentDock.level &&
      (dock.id === dockId - 1 || dock.id === dockId + 1)
    );

    console.log(neighbors);

    return neighbors.some(d => d.currentShip !== null);
  }

  shipHasReservation(shipId: number): boolean {
    const docks: any[] = this.dockService.getDocks();
    return docks.some(dock => dock.currentShip?.id === shipId);
  }

  loadUserShips(): void {
    this.shipService.loadMyShips().subscribe({
      next: (ships) => {
        this.userShips = ships;
      },
      error: (err) => {
        console.error('Fout bij ophalen van schepen:', err);
      }
    });
  }

  onSubmit() {
    console.log('Form valid:', this.checkoutFormGroup.valid);

    Object.keys(this.checkoutFormGroup.controls).forEach((key) => {
      const control = this.checkoutFormGroup.get(key);
      if (control?.invalid) {
        console.log(`${key} is invalid:`, control.errors);
      }
    });

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Haal de reservation form group op en controleer of deze bestaat
    const reservationFormGroup = this.checkoutFormGroup.get('reservation');
    console.log('Reservation form group:', reservationFormGroup);  // Voeg deze regel toe

    if (!reservationFormGroup) {
      console.error('Fout: reservation form group is null');
      return;
    }

    const shipId = Number(reservationFormGroup.get('shipId')?.value);
    const dockId = Number(reservationFormGroup.get('dockId')?.value);
    const startTime = reservationFormGroup.get('startTime')?.value;
    const endTime = reservationFormGroup.get('endTime')?.value;

    // Functie om de tijd te formatteren naar "YYYY-MM-DDTHH:MM:00"
    function formatDateToLocalDateTimeWithoutSeconds(date: string): string {
      const d = new Date(date);
      return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0') + 'T' +
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':00'; // Geen seconden
    }

    // Conversie naar gewenst formaat
    const formattedStartTime = formatDateToLocalDateTimeWithoutSeconds(startTime);
    const formattedEndTime = formatDateToLocalDateTimeWithoutSeconds(endTime);


    console.log('Formatted StartTime:', formattedStartTime);
    console.log('Formatted EndTime:', formattedEndTime);

    if (!shipId || !dockId || !formattedStartTime || !formattedEndTime) {
      console.error('Fout: Niet alle velden zijn ingevuld', {
        shipId,
        dockId,
        formattedStartTime,
        formattedEndTime,
      });
      alert('Niet alle velden zijn ingevuld!');
      return;
    }

    const reservation: Reservation = {
      shipId,
      dockId,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    console.log('📦 Verzenden naar backend (reservation):', reservation);

    this.reservationService.createReservation(reservation).subscribe({
      next: (response) => {
        console.log('✅ Reservering gelukt:', response);

        Swal.fire({
          iconHtml: '<img src="assets/images/ships/ship-fighter.svg" style="width: 50px; height: 50px;" />',
          title: 'Reservation was successfully created!',
          text: 'You have successfully docked your spaceship! Ready for the next adventure.',
          confirmButtonText: 'Go to Confirmation',
          confirmButtonColor: '#1e3a8a',
          background: '#111',
          color: '#fff',
          backdrop: 'rgba(0, 0, 0, 0.5)',
          showCancelButton: false,
          allowOutsideClick: false,
          customClass: {
            popup: 'space-popup',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/account');
          }
        });
      },
      error: (err) => {
        console.error('❌ Fout bij reservering:', err);
        alert('Reservering is mislukt: ' + err.error.message);
      },
    });
  }

  goToHangar() {
    this.router.navigate(['']);
  }
}
