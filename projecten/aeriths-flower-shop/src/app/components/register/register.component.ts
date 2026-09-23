import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent {
  user: any = {};
  checkoutFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
      private router: Router, private authService: AuthService){}


  ngOnInit(): void{
    this.checkoutFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        password: new FormControl('',   [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
         ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ])
    })
  })
}

  register() {

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registratie succesvol! Response van de server:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registratiefout:', error);
      }
    });
  }
}
