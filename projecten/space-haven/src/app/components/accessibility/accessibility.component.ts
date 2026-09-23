import { Component } from '@angular/core';
import { FontSizeService } from '../../services/accessibility-service.service';

@Component({
  selector: 'app-accessibility',
  imports: [],
  templateUrl: './accessibility.component.html',
  styleUrl: './accessibility.component.scss'
})
export class AccessibilityComponent {
  constructor(private fontSizeService: FontSizeService) {}

  increaseFont(): void {
    this.fontSizeService.increaseFontSize();
  }

  decreaseFont(): void {
    this.fontSizeService.decreaseFontSize();
  }

  resetFont(): void {
    this.fontSizeService.resetFontSize();
  }

}
