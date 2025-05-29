import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage = '';
  isRegistering = false;
  passwordMismatch = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.passwordMismatch = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: err => this.errorMessage = err.error.message || 'Login failed',
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    const { name, username, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    this.authService.register(name, username, password).subscribe({
      next: () => {
        this.registerForm.reset();
        this.isRegistering = false;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.error.message || 'Registration failed',
    });
  }
}
