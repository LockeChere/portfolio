import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {UserService} from '../services/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private router = inject(Router);
  userService = inject(UserService);

  goToUser(userId: string | null): void {
    if (userId) {
      this.router.navigate(['/user', userId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  public isAdmin(): boolean {
    this.userService.getUserRole()
    return localStorage.getItem("role") === "ROLE_ADMIN";
  }

  ngOnInit(): void{

    }

}
