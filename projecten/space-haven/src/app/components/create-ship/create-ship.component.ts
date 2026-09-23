import { Component } from '@angular/core';
import { Ship } from '../../models/ship.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ShipService } from '../../services/ship.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-ship',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './create-ship.component.html',
  styleUrl: './create-ship.component.scss'
})
export class CreateShipComponent {
  editingShip: Ship | null = null;
  ships: Ship[] = [];
  shipForm: FormGroup;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService,
              private shipService: ShipService,
              private router: Router){
    this.shipForm = this.fb.group({
      imgUrl: ['', Validators.required],
      size: ['', Validators.required],
      carryingDangerous: ['', Validators.required],
      shipTypeId: [null, Validators.required]})
  }

  addShip(): void {
    // Log de formulierwaarden om te zien wat er ingevuld is
    console.log('Formulierwaarden:', this.shipForm.value);

    // Maak het nieuwe schip object op basis van de formulierdata
    const newShip: Ship = {
      imgUrl: this.shipForm.value.imgUrl,
      size: this.shipForm.value.size,
      carryingDangerous: !!this.shipForm.value.carryingDangerous,  // Zet om naar een boolean
      shipTypeId: this.shipForm.value.shipTypeId
    };

    // Log het nieuw gemaakte schip object
    console.log('Nieuw schip object:', newShip);

    // Log de JSON data die naar de backend wordt gestuurd
    const jsonData = JSON.stringify(newShip);
    console.log('JSON verzonden naar backend:', newShip);

    // Stuur het nieuwe schip naar de backend via de service
    this.shipService.addShip(newShip).subscribe(
      (response) => {
        console.log('✅ Schip succesvol aangemaakt!', response);
        alert('Ship successfully created!');
        this.router.navigate(['/account']);  // Navigeren naar de accountpagina
      },
      (error) => {
        console.error('❌ Fout bij het aanmaken van schip:', error);
        alert('Error creating ship!');  // Toon een foutmelding als het misgaat
      }
    );

    // Voeg het schip toe aan de lokale lijst van schepen
    this.ships.push(newShip);
    console.log('📦 Nieuw schip toegevoegd aan lokale lijst:', this.ships);

    // Reset het formulier na het toevoegen van het schip
    this.shipForm.reset();
    console.log('🧹 Formulier gereset');
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }
}
