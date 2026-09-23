import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {TranslateModule} from '@ngx-translate/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['../../main-styles/auth-form.scss']
})
export class LoginComponent {

  private userService = inject(UserService);
  private cartService = inject(ShoppingCartService);
  private router = inject(Router);

  protected errorMessage: string | null = null;

  protected loginForm = new FormGroup({
    "email" : new FormControl("", [Validators.required, Validators.email]),
    "password" : new FormControl("", [Validators.required, Validators.minLength(2)])
  });

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  protected login(): void {
    this.errorMessage = null; // Reset error message on new login attempt
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    if (email && password) {
      this.userService.login(email, password).subscribe({
        next: (response) => {
          const userId = response.userId;
          if (userId) {
            this.cartService.setUser(userId);
            this.router.navigate(["products"]);
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'auth.login.invalid-credentials';
          } else if (error.status === 0) {
            this.errorMessage = 'auth.login.network-error';
          } else {
            this.errorMessage = 'auth.login.unknown-error';
          }
        }
      });
    }
  }
}
