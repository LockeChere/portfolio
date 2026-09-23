import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {ClassService} from '../../services/class.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AccessibilityComponent } from "../accessibility/accessibility.component";

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    TranslatePipe,
    MatIconModule,
    AccessibilityComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  availableLanguages = ['nl', 'en', 'gb'];
  currentLanguage = 'nl';
  dropdown = false;
  private translate = inject(TranslateService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private classService = inject(ClassService);
  protected isAdmin = computed(() => this.authService.isAdminSignal());

  protected isLoggedIn = this.authService.isLoggedIn;

  constructor() {
    const savedLang = localStorage.getItem('lang');
    this.currentLanguage = savedLang || 'nl';
    this.translate.use(this.currentLanguage);
    if (this.isLoggedIn()) {
      this.authService.checkRoleOnBackend();
    }
  }


  GoToLogIn() {
    this.router.navigate(['/login']);
  }

  GoToAccount() {
     this.router.navigate(['/account']);
  }

  LogOut() {
    this.authService.logout();
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  closeDropdown() {
    this.dropdown = false;
  }

  switchLanguage(lang: string) {
    if (lang === 'gb') {
      this.classService.SetClassOfApp("aurebesh")
    } else {
      this.classService.RemoveClassOfApp("aurebesh")
      this.currentLanguage = lang;
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
      this.dropdown = false;
    }

  }
}
