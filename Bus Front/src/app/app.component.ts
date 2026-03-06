import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4" *ngIf="isLoggedIn$ | async">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/dashboard">
          <i class="bi bi-bus-front me-2"></i>
          <span>Bus Finance</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active font-weight-bold">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/add" routerLinkActive="active font-weight-bold">Add Record</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/view" routerLinkActive="active font-weight-bold">View Records</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/search" routerLinkActive="active font-weight-bold">Search</a>
            </li>
            <li class="nav-item ms-lg-3">
              <button class="btn btn-outline-light btn-sm" (click)="onLogout()">
                <i class="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="mt-auto py-3 text-center text-muted border-top bg-white" *ngIf="isLoggedIn$ | async">
      <div class="container">
        <span class="small">&copy; 2024 Bus Daily Finance Management System</span>
      </div>
    </footer>
  `,
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main { flex: 1; }
    .navbar-brand { font-size: 1.4rem; font-weight: 700; }
    .nav-link.active { color: #fff !important; }
  `]
})
export class AppComponent {
    isLoggedIn$: Observable<boolean>;

    constructor(private authService: AuthService) {
        this.isLoggedIn$ = this.authService.isAuthenticated();
    }

    onLogout(): void {
        if (confirm('Are you sure you want to logout?')) {
            this.authService.logout();
        }
    }
}
