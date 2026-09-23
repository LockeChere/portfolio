import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserService} from '../services/user.service';
import {Observable} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="admin-dashboard-retro">
      <h1 class="retro-title">{{ 'admin.dashboard' | translate }}</h1>
      <div class="retro-admin-menu">
        <button class="retro-menu-btn" routerLink="/admin/giftcards">{{ 'admin.manage-giftcards' | translate }}</button>
      </div>
    </div>
  `,
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isAdmin$: Observable<boolean>;

  constructor(private userService: UserService) {
    this.isAdmin$ = this.userService.getIsAdmin();
  }

  ngOnInit(): void {
    // Check if user is admin, if not redirect to home
    this.isAdmin$.subscribe(isAdmin => {
      if (!isAdmin) {
        // Handle non-admin access
      }
    });
  }
}
