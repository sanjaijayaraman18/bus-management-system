import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <!-- Background Layers -->
      <div class="bg-wrapper">
        <div class="bg-image"></div>
        <div class="bg-lighting"></div>
        <div class="bg-overlay"></div>
        
        <!-- Decorative CSS Particles -->
        <div class="particles">
          <div class="particle" *ngFor="let p of [1,2,3,4,5,6,7,8]"></div>
        </div>
      </div>
      
      <div class="login-content">
        <div class="login-glass-card animate__animated animate__zoomIn">
          <div class="glass-header text-center mb-4">
            <div class="bus-icon-container mb-3">
               <i class="bi bi-bus-front"></i>
            </div>
            <h2 class="company-name text-uppercase">BRAMMA TRANSPORT</h2>
            <p class="app-subtitle">Bus Daily Finance Management System</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="glass-form">
            <div class="form-field mb-3">
              <label class="glass-label">Email / Username</label>
              <div class="glass-input-group">
                <i class="bi bi-person-fill glass-icon"></i>
                <input type="text" class="glass-input" formControlName="username" placeholder="bramma@gmail.com">
              </div>
            </div>

            <div class="form-field mb-4">
              <label class="glass-label">Password</label>
              <div class="glass-input-group">
                <i class="bi bi-shield-lock-fill glass-icon"></i>
                <input type="password" class="glass-input" formControlName="password" placeholder="••••••••">
              </div>
            </div>
            
            <button type="submit" class="glass-btn btn-cinematic w-100" [disabled]="loginForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <span *ngIf="!loading"><i class="bi bi-box-arrow-in-right me-2"></i> Sign In</span>
              <div class="btn-glow"></div>
            </button>
          </form>

          <div *ngIf="errorMessage" class="glass-alert animate__animated animate__shakeX">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          </div>

          <div class="glass-footer text-center mt-4">
            <p class="security-note">Authorized Administrator Access Only</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      position: relative;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start; /* Move to left */
      padding-left: 8%; /* Side spacing */
      font-family: 'Inter', sans-serif;
    }

    /* Background Layering */
    .bg-wrapper {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: -1;
    }

    .bg-image {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image: url('/images/sanjai.png');
      background-size: cover;
      background-position: center;
      filter: none; /* Removed blur as requested */
    }

    /* Colorful Gradient Lighting Effect */
    .bg-lighting {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(circle at 20% 30%, rgba(255, 65, 108, 0.4) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(46, 191, 255, 0.3) 0%, transparent 40%),
                  radial-gradient(circle at 50% 50%, rgba(255, 147, 0, 0.2) 0%, transparent 50%);
      mix-blend-mode: color-dodge;
      animation: shiftLighting 15s infinite alternate ease-in-out;
    }

    @keyframes shiftLighting {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 0.8; transform: scale(1.1); }
    }

    .bg-overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    /* Floating Particles */
    .particles {
      position: absolute;
      width: 100%; height: 100%;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255,255,255,0.4);
      animation: floatParticle 25s infinite linear;
    }

    .particle:nth-child(1) { width: 4px; height: 4px; left: 10%; top: 20%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 6px; height: 6px; left: 30%; top: 50%; animation-delay: -5s; }
    .particle:nth-child(3) { width: 3px; height: 3px; left: 70%; top: 10%; animation-delay: -10s; }
    .particle:nth-child(4) { width: 5px; height: 5px; left: 85%; top: 80%; animation-delay: -15s; }
    .particle:nth-child(5) { width: 4px; height: 4px; left: 50%; top: 40%; animation-delay: -2s; }
    .particle:nth-child(6) { width: 7px; height: 7px; left: 15%; top: 75%; animation-delay: -8s; }
    .particle:nth-child(7) { width: 2px; height: 2px; left: 40%; top: 90%; animation-delay: -12s; }
    .particle:nth-child(8) { width: 4px; height: 4px; left: 90%; top: 30%; animation-delay: -4s; }

    @keyframes floatParticle {
      from { transform: translateY(0) rotate(0deg); opacity: 0; }
      20% { opacity: 0.8; }
      80% { opacity: 0.8; }
      to { transform: translateY(-300px) rotate(360deg); opacity: 0; }
    }

    .login-content {
      z-index: 10;
      width: 100%;
      max-width: 480px;
      padding: 20px;
    }

    /* Glassmorphism Card Refined */
    .login-glass-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(25px) saturate(150%);
      -webkit-backdrop-filter: blur(25px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 30px;
      padding: 50px 40px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5),
                  inset 0 0 20px rgba(255,255,255,0.05);
      color: white;
      text-align: center;
    }

    .bus-icon-container {
      font-size: 2.8rem;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
      width: 85px; height: 85px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 22px;
      margin: 0 auto;
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      color: #fff;
    }

    .company-name {
      font-weight: 900;
      font-size: 1.9rem;
      letter-spacing: 5px;
      margin-top: 25px;
      margin-bottom: 5px;
      background: linear-gradient(to bottom, #fff, #ccc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .app-subtitle {
      font-weight: 300;
      font-size: 0.85rem;
      opacity: 0.7;
      letter-spacing: 1.2px;
      margin-bottom: 0;
    }

    .glass-form { margin-top: 40px; }

    .glass-label {
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 10px;
      display: block;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 2px;
      text-align: left;
    }

    .glass-input-group {
      position: relative;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-input-group:focus-within {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(46, 191, 255, 0.5);
      box-shadow: 0 0 20px rgba(46, 191, 255, 0.15);
      transform: translateY(-2px);
    }

    .glass-icon {
      position: absolute;
      left: 18px; top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .glass-input {
      width: 100%; height: 54px;
      padding: 0 20px 0 55px;
      background: transparent;
      border: none;
      color: white;
      outline: none;
      font-size: 1rem;
    }

    .glass-input::placeholder { color: rgba(255, 255, 255, 0.3); }

    /* Cinematic Gradient Button */
    .btn-cinematic {
      position: relative;
      background: linear-gradient(90deg, #ff416c, #ff4b2b, #f09819);
      background-size: 200% auto;
      border: none;
      height: 60px;
      border-radius: 16px;
      color: white;
      font-weight: 800;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all 0.5s ease;
      cursor: pointer;
      overflow: hidden;
      margin-top: 15px;
      box-shadow: 0 10px 30px rgba(255, 75, 43, 0.3);
    }

    .btn-cinematic:hover {
      background-position: right center;
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 40px rgba(255, 75, 43, 0.4);
    }

    .btn-glow {
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
    }

    .btn-cinematic:hover .btn-glow { left: 100%; transition: 0.6s linear; }

    .glass-alert {
      margin-top: 25px;
      padding: 15px;
      background: rgba(255, 65, 108, 0.2);
      border: 1px solid rgba(255, 65, 108, 0.4);
      border-radius: 14px;
      font-size: 0.95rem;
      backdrop-filter: blur(10px);
    }

    .security-note {
      font-size: 0.8rem;
      opacity: 0.5;
      font-style: italic;
      letter-spacing: 0.5px;
    }

    @media (max-width: 576px) {
      .login-glass-card { padding: 40px 30px; }
      .company-name { font-size: 1.6rem; letter-spacing: 3px; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid credentials or server error';
        }
      });
    }
  }
}
