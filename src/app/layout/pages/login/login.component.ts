import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import e, { response } from 'express';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Core/Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  private loginSub?: Subscription;
  errorMassage: string = '';
  loading: boolean = false;

  constructor(private readonly _AuthService:AuthService, private readonly _Router:Router) { }

  loginForm = new FormGroup({ 
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
       Validators.pattern(/^[A-Z][a-z0-9]{5,}$/) // Example: starts with capital, min 6 chars
    ]),
      
  })

  togglePassword(input: HTMLInputElement, icon: HTMLElement) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  onSubmit(data: any) : any {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return false;
    }
    else {
      this.loading = true
      this.loginSub = this._AuthService.login(data.value).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          // Store the token in localStorage
          const token = response.token;
          localStorage.setItem('token', token);
          
          
          this._Router.navigate(['/home']);
          this._AuthService.isLogging.next(true);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.errorMassage = error.error.message;
        }
      })
    }
  }

   ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
