import { Component } from '@angular/core';
import { FontSizeService } from '../../services/font-size-service.service';


@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
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
