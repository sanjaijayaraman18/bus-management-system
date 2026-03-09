import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="quantum-bg h-100 w-100 position-fixed animate__animated animate__fadeIn"></div>
    
    <div class="auth-wrapper animate__animated animate__fadeIn">
      <div class="glass-panel auth-card animate__animated animate__zoomIn">
        
        <!-- Header Section -->
        <div class="text-center mb-5 animate__animated animate__fadeInDown animate__delay-1s">
          <div class="fintech-icon-box mx-auto mb-4">
            <i class="bi bi-bus-front-fill"></i>
          </div>
          <h1 class="brand-title mb-1">BUS MANAGEMENT SYSTEM</h1>
          <div class="subtitle-badge">
            <span class="pulse-dot me-2"></span>
            Operational Finance Console
          </div>
        </div>
        
        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="animate__animated animate__fadeInUp animate__delay-1s">
          <div class="mb-4">
            <label class="form-label mb-2">Email / Username</label>
            <div class="input-glow-wrapper">
              <input type="email" 
                     class="form-control q-input" 
                     formControlName="email" 
                     placeholder="manager@busfinance.com">
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label m-0">Security Key</label>
            </div>
            <div class="input-glow-wrapper">
              <input type="password" 
                     class="form-control q-input" 
                     formControlName="password" 
                     placeholder="••••••••">
            </div>
          </div>
          
          <button type="submit" 
                  class="btn-quantum-primary w-100 mt-3 d-flex align-items-center justify-content-center gap-2 py-3" 
                  [disabled]="loginForm.invalid || loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm"></span>
            {{ loading ? 'Accessing Data...' : 'Launch System' }}
            <i class="bi bi-arrow-right-short fs-4" *ngIf="!loading"></i>
          </button>
          
          <div *ngIf="errorMessage" class="error-toast mt-4 animate__animated animate__shakeX">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          </div>

          <div class="text-center mt-5">
            <p class="registration-prompt mb-0">
              New manager? 
              <a routerLink="/register" class="glow-link ms-1">Register Account</a>
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
      max-width: 440px;
      padding: 3.5rem 2.5rem;
      border-radius: 28px;
    }

    .fintech-icon-box {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, var(--q-primary) 0%, #2563eb 100%);
      color: white;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.75rem;
      letter-spacing: -0.5px;
      line-height: 1.2;
      background: linear-gradient(to bottom, #fff 40%, rgba(255, 255, 255, 0.6));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
    }

    .subtitle-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--q-text-muted);
      border: 1px solid rgba(255, 255, 255, 0.05);
      letter-spacing: 0.5px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--q-success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .q-input {
      background: rgba(255, 255, 255, 0.03) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      font-size: 1rem !important;
      padding: 1rem 1.25rem !important;
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

    /* Override btn-quantum-primary specifically for login padding */
    .btn-quantum-primary {
      border-radius: 14px;
      font-size: 1rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  transportName = 'BUS SYSTEMS';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const storedName = localStorage.getItem('transportName');
    if (storedName) {
      this.transportName = storedName;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Invalid credentials or server error';
        }
      });
    }
  }
}
