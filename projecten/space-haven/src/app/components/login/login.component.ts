import {Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  protected loginForm = new FormGroup({
    "email": new FormControl("",[ Validators.required, Validators.email]),
    "password": new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  private credentials = { email: '', password: '' };
  protected errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.credentials = { email: this.loginForm.value.email!, password: this.loginForm.value.password! };
    this.authService.login(this.credentials).subscribe({
      next: (resData) => {
        this.authService.saveUserToLocalStorage(resData);
        this.authService.isLoggedIn.set(true);
        this.authService.checkRoleOnBackend(resData.token);
        this.router.navigate(['/']);
        window.location.reload();
      },
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
