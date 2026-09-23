import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ClassService {
  SetClassOfApp(className: string): void {
    const appElement = document.querySelector('app-root');
    if (appElement) {
      const element = appElement as HTMLElement;
      element.classList.add(className);
    }
  }

  RemoveClassOfApp(className: string): void {
    const appElement = document.querySelector('app-root');
    if (appElement) {
      const element = appElement as HTMLElement;
      element.classList.remove(className);
    }
  }
}
