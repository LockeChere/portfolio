import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  private defaultSize: number = 16;
  private currentSize: number = this.defaultSize;

  constructor() { }

  increaseFontSize(): void {
    this.currentSize += 2;
    this.applyFontSize();
  }

  decreaseFontSize(): void {
    this.currentSize = Math.max(this.defaultSize, this.currentSize - 2);
    this.applyFontSize();
  }

  resetFontSize(): void {
    this.currentSize = this.defaultSize;
    this.applyFontSize();
  }

  private applyFontSize(): void {
    document.documentElement.style.fontSize = `${this.currentSize}px`;
  }
}
