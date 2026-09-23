import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  [x: string]: any;
  title = 'aeriths-flower-shop';
  currentLang: string = 'en';
  isLoggedIn: boolean = false;

  constructor(private translate: TranslateService, public authService: AuthService, private router: Router) {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.currentLang);
    
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    

  }

  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'nl' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
  }
  
  logout() {
    this.authService.logout(); // Roep de logout-methode aan van AuthService
    this.router.navigate(['/login']); // Navigeer naar de loginpagina
  }


}
