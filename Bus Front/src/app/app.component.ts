import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="quantum-bg" *ngIf="isLoggedIn$ | async"></div>
    
    <nav class="navbar navbar-expand-lg glass-panel sticky-top mx-3 my-3 px-4 py-2 border-0" *ngIf="isLoggedIn$ | async">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center me-5" routerLink="/dashboard">
          <div class="brand-icon me-2">
            <i class="bi bi-bus-front-fill text-gradient-accent"></i>
          </div>
          <span class="fw-bold tracking-tight text-white">Bus <span class="text-accent">Finance</span></span>
        </a>
        
        <button class="navbar-toggler border-0 shadow-none text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
           <i class="bi bi-list fs-2"></i>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/dashboard" routerLinkActive="active-glow" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/add" routerLinkActive="active-glow">Add Record</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/view" routerLinkActive="active-glow">View Records</a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/staff-registration" routerLinkActive="active-glow">Register Staff</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/staff-reports" routerLinkActive="active-glow">Staff Reports</a>
            </li>
          </ul>
          
          <div class="d-flex align-items-center gap-3">
             <!-- User Pill -->
             <div class="user-pill-glamor d-none d-lg-flex align-items-center px-4 py-2 rounded-pill">
                <div class="user-avatar-mini me-2">
                   <i class="bi bi-person-fill"></i>
                </div>
                <span class="x-small fw-bold tracking-widest text-uppercase">{{ transportName || 'Administrator' }}</span>
             </div>

             <!-- Logout Button -->
             <button class="btn btn-logout-glow d-flex align-items-center gap-2" (click)="onLogout()">
                <i class="bi bi-box-arrow-right"></i>
                <span class="fw-bold text-uppercase small tracking-wider">Logout</span>
             </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="page-container" [class.authenticated-main]="isLoggedIn$ | async">
      <router-outlet></router-outlet>
    </main>

    <footer class="py-4 text-center border-top border-white border-opacity-10 mt-auto" *ngIf="isLoggedIn$ | async">
      <div class="container">
        <p class="mb-1 small opacity-50">&copy; 2024 Bus Daily Finance Management System</p>
        <div class="d-flex justify-content-center gap-3 small opacity-25">
           <span>Privacy Policy</span>
           <span>Support</span>
           <span>v2.0 Quantum</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      color: #f8fafc;
    }
    
    .navbar {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      animation: slideInDown 0.6s ease-out;
    }
    
    .navbar-brand span {
      font-size: 1.4rem;
      letter-spacing: -0.8px;
    }
    
    .brand-icon {
      width: 38px;
      height: 38px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .nav-link {
      color: var(--q-text-muted) !important;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.25s ease;
      position: relative;
    }
    
    .nav-link:hover {
      color: #fff !important;
      transform: translateY(-1px);
    }
    
    .active-glow {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    /* User Pill Glamor */
    .user-pill-glamor {
       background: rgba(255, 255, 255, 0.03);
       border: 1px solid rgba(255, 255, 255, 0.1);
       color: #fff;
       box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    .user-avatar-mini {
       width: 24px; height: 24px;
       background: rgba(59, 130, 246, 0.2);
       color: var(--q-primary);
       border-radius: 50%;
       display: flex; align-items: center; justify-content: center;
       font-size: 0.8rem;
    }

    /* Logout Glow Brush */
    .btn-logout-glow {
       background: var(--q-accent);
       color: #fff;
       border: none;
       border-radius: 12px;
       padding: 0.6rem 1.5rem;
       transition: all 0.3s ease;
       box-shadow: 0 4px 15px rgba(255, 122, 0, 0.3);
    }
    .btn-logout-glow:hover {
       transform: translateY(-2px);
       box-shadow: 0 8px 25px rgba(255, 122, 0, 0.5);
       background: #ff8c21;
    }

    .page-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .authenticated-main {
      padding-top: 0;
    }

    .text-accent { color: var(--q-accent); }
    .x-small { font-size: 0.7rem; }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  transportName: string = '';

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        const user = this.authService.getCurrentUser();
        this.transportName = user?.transportName || '';
      }
    });
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
