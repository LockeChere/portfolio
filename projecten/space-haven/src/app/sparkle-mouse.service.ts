import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SparkleMouseService {

  constructor() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }
  

  private handleMouseMove(event: MouseEvent): void {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerText = '✨'; 

    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }

}
