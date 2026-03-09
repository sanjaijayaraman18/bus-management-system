import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper dashboard-inner overflow-hidden">
      <div class="container py-lg-5">
        
        <!-- Premium Header -->
        <div class="text-center mb-5 animate__animated animate__fadeInDown">
          <div class="brand-glow-container mx-auto mb-4 animate-float">
             <div class="brand-badge-premium">
                <i class="bi bi-bus-front-fill"></i>
             </div>
             <div class="brand-glow"></div>
          </div>
          <h1 class="quantum-title fw-bold text-white mb-2">
            <span class="text-gradient-accent text-uppercase">{{ transportName }}</span>
          </h1>
          <div class="d-flex align-items-center justify-content-center gap-2 opacity-50">
             <div class="header-line"></div>
             <span class="text-uppercase tracking-widest small fw-bold">Management Console v2.0</span>
             <div class="header-line"></div>
          </div>
        </div>

        <!-- Action Grid -->
        <div class="dashboard-grid mt-4">
          <!-- Create Daily Report -->
          <a routerLink="/add" class="glass-card action-tile accent-blue animate__animated animate__fadeInUp">
            <div class="tile-icon-wrapper">
              <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">Create Daily Report</h5>
              <p class="tile-desc">Log trip collection, diesel, and operational expenses</p>
              <div class="tile-action">
                 <span>Start Entry</span>
                 <i class="bi bi-arrow-right ms-2"></i>
              </div>
            </div>
          </a>

          <!-- View Reports -->
          <a routerLink="/view" class="glass-card action-tile accent-green animate__animated animate__fadeInUp animate__delay-1s">
            <div class="tile-icon-wrapper">
              <i class="bi bi-journal-check"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">View Reports</h5>
              <p class="tile-desc">Review historical reports and profitability analysis</p>
              <div class="tile-action">
                 <span>Browse Archive</span>
                 <i class="bi bi-arrow-right ms-2"></i>
              </div>
            </div>
          </a>

          <!-- Staff Hub -->
          <a routerLink="/staff-list" class="glass-card action-tile accent-purple animate__animated animate__fadeInUp animate__delay-1s">
            <div class="tile-icon-wrapper">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">Staff Hub</h5>
              <p class="tile-desc">Manage driver, conductor and cleaner rosters & balances</p>
              <div class="tile-action">
                 <span>Manage System</span>
                 <i class="bi bi-arrow-right ms-2"></i>
              </div>
            </div>
          </a>

          <!-- View Workers -->
          <a routerLink="/worker-list" class="glass-card action-tile accent-orange animate__animated animate__fadeInUp animate__delay-1s">
            <div class="tile-icon-wrapper">
              <i class="bi bi-person-lines-fill"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">View Workers</h5>
              <p class="tile-desc">Unified consolidated list of all active transport crew</p>
              <div class="tile-action">
                 <span>Open Directory</span>
                 <i class="bi bi-arrow-right ms-2"></i>
              </div>
            </div>
          </a>

          <!-- Staff Registration (Unified) -->
          <a routerLink="/staff-registration" class="glass-card action-tile accent-cyan animate__animated animate__fadeInUp animate__delay-2s">
            <div class="tile-icon-wrapper">
              <i class="bi bi-person-plus-fill"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">Register Staff</h5>
              <p class="tile-desc">Onboard new drivers, conductors, or cleaners to the system</p>
            </div>
          </a>

          <!-- Network Routes -->
          <a routerLink="/add-route" class="glass-card action-tile accent-indigo animate__animated animate__fadeInUp animate__delay-2s">
            <div class="tile-icon-wrapper">
              <i class="bi bi-map-fill"></i>
            </div>
            <div class="tile-content">
              <h5 class="tile-title">Network Routes</h5>
              <p class="tile-desc">Define and optimize bus travel paths and schedules</p>
            </div>
          </a>
        </div>

        <!-- Quick Summary Section -->
        <div class="mt-5 pt-4 text-center animate__animated animate__fadeIn animate__delay-3s">
           <div class="glass-panel d-inline-flex p-3 px-4 align-items-center gap-4 border-opacity-10">
              <div class="text-start">
                 <div class="x-small text-uppercase opacity-50 fw-bold">System Status</div>
                 <div class="small fw-bold"><i class="bi bi-circle-fill text-success x-small me-2"></i>Operational</div>
              </div>
              <div class="divider-v"></div>
              <div class="text-start">
                 <div class="x-small text-uppercase opacity-50 fw-bold">Active Buses</div>
                 <div class="small fw-bold">12 Fleet Members</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-inner {
      background: transparent;
    }

    .brand-glow-container {
      position: relative;
      width: 5rem; height: 5rem;
    }

    .brand-badge-premium {
      width: 100%; height: 100%;
      background: var(--q-accent);
      color: #fff;
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem;
      position: relative;
      z-index: 2;
      box-shadow: 0 10px 30px var(--q-accent-glow);
    }

    .brand-glow {
      position: absolute;
      top: 50%; left: 50%;
      width: 120%; height: 120%;
      background: var(--q-accent);
      filter: blur(40px);
      opacity: 0.3;
      transform: translate(-50%, -50%);
    }

    .quantum-title {
      font-size: 2.75rem;
      letter-spacing: -1px;
    }

    .header-line {
      width: 40px; height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .tracking-widest { letter-spacing: 3px; }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      align-items: stretch;
    }

    /* Accent Classes System */
    .accent-blue   { --tile-accent: #3b82f6; --tile-accent-glow: rgba(59, 130, 246, 0.5); --tile-accent-subtle: rgba(59, 130, 246, 0.1); }
    .accent-green  { --tile-accent: #10b981; --tile-accent-glow: rgba(16, 185, 129, 0.5); --tile-accent-subtle: rgba(16, 185, 129, 0.1); }
    .accent-purple { --tile-accent: #a855f7; --tile-accent-glow: rgba(168, 85, 247, 0.5); --tile-accent-subtle: rgba(168, 85, 247, 0.1); }
    .accent-orange { --tile-accent: #ff7a00; --tile-accent-glow: rgba(255, 122, 0, 0.5); --tile-accent-subtle: rgba(255, 122, 0, 0.1); }
    .accent-cyan   { --tile-accent: #06b6d4; --tile-accent-glow: rgba(6, 182, 212, 0.5); --tile-accent-subtle: rgba(6, 182, 212, 0.1); }
    .accent-pink   { --tile-accent: #ec4899; --tile-accent-glow: rgba(236, 72, 153, 0.5); --tile-accent-subtle: rgba(236, 72, 153, 0.1); }
    .accent-teal   { --tile-accent: #14b8a6; --tile-accent-glow: rgba(20, 184, 166, 0.5); --tile-accent-subtle: rgba(20, 184, 166, 0.1); }
    .accent-indigo { --tile-accent: #6366f1; --tile-accent-glow: rgba(99, 102, 241, 0.5); --tile-accent-subtle: rgba(99, 102, 241, 0.1); }

    .action-tile {
      --tile-accent: var(--q-primary);
      --tile-accent-glow: var(--q-primary-glow);
      --tile-accent-subtle: rgba(255,255,255,0.03);
      
      display: flex;
      padding: 1.75rem;
      height: 100%;
      text-decoration: none;
      color: inherit;
      gap: 1.5rem;
      align-items: flex-start;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 1;
    }

    .action-tile::before {
      content: '';
      position: absolute;
      inset: -50%;
      background: conic-gradient(
        transparent,
        transparent,
        transparent,
        var(--tile-accent)
      );
      animation: rotate-border 4s linear infinite;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .action-tile:hover::before {
      opacity: 0.6;
    }

    .action-tile::after {
      content: '';
      position: absolute;
      inset: 2px;
      background: #0f172a;
      border-radius: 22px;
      z-index: -1;
    }

    @keyframes rotate-border {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .action-tile:hover {
      transform: translateY(-8px) scale(1.03);
      border-color: var(--tile-accent);
      box-shadow: 0 15px 35px var(--tile-accent-glow);
    }

    .tile-icon-wrapper {
      min-width: 56px; height: 56px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
      background: var(--tile-accent-subtle);
      color: var(--tile-accent);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .tile-content { flex: 1; }
    .tile-title { font-weight: 700; color: #fff; margin-bottom: 0.5rem; transition: all 0.3s ease; }
    .tile-desc { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0; line-height: 1.5; }

    .tile-action {
      margin-top: 1.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--tile-accent);
      opacity: 0.6;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    }

    .action-tile:hover .tile-title { color: var(--tile-accent); }
    .action-tile:hover .tile-action {
      opacity: 1;
      transform: translateX(5px);
    }

    .action-tile:hover .tile-icon-wrapper {
        transform: scale(1.15) rotate(8deg);
    }

    .divider-v { width: 1px; height: 30px; background: rgba(255, 255, 255, 0.1); }
    .x-small { font-size: 0.7rem; }
  `]
})
export class DashboardComponent implements OnInit {
  transportName: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.transportName) {
      this.transportName = user.transportName;
    } else {
      // Fallback to legacy or default
      const storedName = localStorage.getItem('transportName');
      this.transportName = storedName || 'Transport';
    }
  }
}

