import { Component } from '@angular/core';
import { ShipService } from '../../services/ship.service';
import { Ship } from '../../models/ship.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ship',
  imports: [TranslateModule, CommonModule],
  templateUrl: './ship.component.html',
  styleUrl: './ship.component.scss'
})
export class ShipComponent {
  ships: any[] = [];
  user: any = {};

  constructor(private shipService: ShipService) {}

  ngOnInit(): void {
    this.shipService.loadMyShips().subscribe(
      (data) => {
        this.ships = data;
        for(const ship of this.ships) {
          console.log(ship);
        }
      },
      (error) => {
        console.error('Error while retrieving ships:', error);
      }
    );
  }

  getShipImageUrl(ship: Ship): string {
    return `assets/images/${ship.imgUrl}`;
  }

}
