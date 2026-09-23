import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent {
  user: any = {};
  checkoutFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
      private router: Router, private authService: AuthService, private translate: TranslateService){}

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
  get userFormGroup(): FormGroup {
    return this.checkoutFormGroup.get('user') as FormGroup;
  }

  register() {
    this.user = this.checkoutFormGroup.get('user')!.value;

    console.log('Registratie gestart:', this.user); 

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registratie succesvol! Response van de server:', response);
        this.translate.get('register_success').subscribe((translatedSuccessMessage: string) => {
          alert(translatedSuccessMessage); 
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registratiefout:', error);
        this.translate.get('register_failed').subscribe((translatedSuccessMessage: string) => {
          alert(translatedSuccessMessage); 
        });
      }
    });
  }
}

