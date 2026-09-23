import { Component, OnInit } from '@angular/core';
import { Dock } from '../../models/dock.model';
import { DockService } from '../../services/dock.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dock-info',
  imports: [CommonModule],
  templateUrl: './dock-info.component.html',
  styleUrl: './dock-info.component.scss'
})
export class DockInfoComponent implements OnInit {
  docks: Dock[] = [];

  constructor(private dockService: DockService) {}

  ngOnInit(): void {
    this.loadDocks();
  }

  loadDocks(): void {
    this.dockService.getAllDocks().subscribe(docks => {
      console.log('Gerefresht:', docks); // check wat de backend teruggeeft
      this.docks = docks;
    });
  }

  // Release het dock, kan in onderhoud staan of een reservering hebben
  releaseDock(dock: Dock): void {
    if (dock.currentReservation || dock.maintenance) {
      this.dockService.releaseDock(dock.id).subscribe(
        (response) => {
          alert(response);
          this.loadDocks();
        },
        (error) => {
          alert('Failed to release dock. Please try again later.');
        }
      );
    } else {
      alert('Dock cannot be released unless it has an active reservation.');
    }
  }
  
  setDockToMaintenance(dock: Dock): void {
    this.dockService.setDockToMaintenance(dock.id).subscribe(
      (response) => {
        alert(response || 'Dock set to maintenance.'); 
        this.loadDocks();
      },
      (error) => {
        if (error.status === 200 || error.status === 201) {
          alert('Dock set to maintenance.');
          this.loadDocks();
        } else {
          alert('Failed to set dock to maintenance. Please try again later.');
        }
      }
    );
  }
  
}