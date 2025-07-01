import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Core/Services/auth.service';
import { Subscription } from 'rxjs';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {

  private registerSub?: Subscription;
  errorMassage: string = '';
  lodding: boolean = false;

  // inject AuthService to handle registration logic
  constructor(private readonly _AuthService: AuthService, private readonly _Router:Router) { }

  // Create a form group for the registration form
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z][a-z0-9]{5,}$/) // Example: starts with capital, min 6 chars
    ]),
    rePassword: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/) // Egyptian phone example
    ]),
  }, this.confirmPassword);

  // method for toggleing password visibility
  togglePassword(input: HTMLInputElement, icon: HTMLElement) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  // method to check confirm password
  confirmPassword(form: any) {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;
    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  // method to call the api
  onSubmit(data: any) {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    else {
      this.lodding = true; // Set loading state to true
      // Call the register method from AuthService
      this.registerSub = this._AuthService.register(data.value).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Handle successful registration, e.g., navigate to login page or show success message
          this.lodding = false; // Reset loading state
          this._Router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle registration error, e.g., show error message
          this.errorMassage = error.error.message;
          this.lodding = false; // Reset loading state
        }
      });
    }

  }

  ngOnDestroy(): void {
    // Unsubscribe from the registration subscription to prevent memory leaks
    this.registerSub?.unsubscribe();
  }
}