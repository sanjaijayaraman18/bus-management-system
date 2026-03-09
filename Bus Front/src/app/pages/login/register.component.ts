import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="quantum-bg h-100 w-100 position-fixed animate__animated animate__fadeIn"></div>
    
    <div class="auth-wrapper animate__animated animate__fadeIn">
      <div class="glass-panel auth-card animate__animated animate__zoomIn">
        
        <!-- Header Section -->
        <div class="text-center mb-4 animate__animated animate__fadeInDown animate__delay-1s">
          <div class="fintech-icon-box mx-auto mb-3">
            <i class="bi bi-bus-front-fill"></i>
          </div>
          <h2 class="auth-title mb-1">REGISTER TRANSPORT</h2>
          <p class="text-white-50 small">Initialize your management system</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-4 row g-3 animate__animated animate__fadeInUp animate__delay-1s">
          <div class="col-md-12">
            <label class="form-label mb-2">Transport Name</label>
            <input type="text" class="form-control q-input" formControlName="transportName" placeholder="e.g. Bramma Transport">
          </div>

          <div class="col-md-12">
            <label class="form-label mb-2">Email / Username</label>
            <input type="email" class="form-control q-input" formControlName="email" placeholder="manager@transport.com">
          </div>

          <div class="col-md-6">
            <label class="form-label mb-2">Password</label>
            <input type="password" class="form-control q-input" formControlName="password" placeholder="••••••••">
          </div>

          <div class="col-md-6">
            <label class="form-label mb-2">Confirm</label>
            <input type="password" class="form-control q-input" formControlName="confirmPassword" placeholder="••••••••"
                   [class.border-danger]="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched">
          </div>
          
          <div class="col-12 mt-4 pt-2">
            <button type="submit" class="btn-quantum-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" [disabled]="registerForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm"></span>
              {{ loading ? 'Creating...' : 'Create Admin Account' }}
              <i class="bi bi-person-plus-fill" *ngIf="!loading"></i>
            </button>
          </div>
          
          <div *ngIf="errorMessage" class="col-12 mt-3">
            <div class="error-toast animate__animated animate__shakeX">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
            </div>
          </div>

          <div *ngIf="registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched" class="col-12 mt-1 text-center">
            <small class="text-danger small">Passwords do not match.</small>
          </div>

          <div class="col-12 text-center mt-5">
            <p class="registration-prompt mb-0">
              Already registered? 
              <a routerLink="/login" class="glow-link ms-1">Back to Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      z-index: 10;
    }

    .auth-card {
      width: 100%;
      max-width: 500px;
      padding: 3rem 2.5rem;
      border-radius: 28px;
    }

    .fintech-icon-box {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--q-primary) 0%, #2563eb 100%);
      color: white;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .auth-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.75rem;
      letter-spacing: -0.5px;
      background: linear-gradient(to bottom, #fff 40%, rgba(255, 255, 255, 0.6));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .q-input {
      background: rgba(255, 255, 255, 0.03) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      font-size: 0.95rem !important;
      padding: 0.8rem 1.1rem !important;
      border-radius: 14px !important;
    }

    .q-input:focus {
      background: rgba(255, 255, 255, 0.06) !important;
      border-color: var(--q-primary) !important;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
    }

    .error-toast {
      background: rgba(239, 68, 68, 0.1);
      color: var(--q-danger);
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(239, 68, 68, 0.2);
      font-size: 0.85rem;
      text-align: center;
    }

    .registration-prompt {
      color: var(--q-text-muted);
      font-size: 0.9rem;
    }

    .glow-link {
      color: var(--q-primary);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .glow-link:hover {
      color: #fff;
      text-shadow: 0 0 15px var(--q-primary-glow);
    }

    .btn-quantum-primary {
      border-radius: 14px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      transportName: ['', [Validators.required, Validators.minLength(3)]],
      name: ['Admin'], // Default internal name
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    return password && confirm && password.value !== confirm.value ? { mismatch: true } : null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Destructure confirmPassword and include transportName in the payload
      const { confirmPassword, ...payload } = this.registerForm.value;
      console.log('Sending registration payload:', { ...payload, password: '****' });

      this.authService.register(payload).subscribe({
        next: (response) => {
          console.log('Registration success:', response);
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Try again.';
        }
      });
    }
  }
}
