import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log("Login success:", response);

        const userEmail = this.authService.getUserEmail();
        console.log("Logged in user's email:", userEmail);

        this.router.navigate(['/members']);
      },
      error => {
        console.error("Login error:", error);
      }
    );
  }
}
