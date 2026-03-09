import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { timeout, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner overflow-hidden">
      <div class="container py-lg-5 animate__animated animate__fadeIn">
        
        <div class="d-flex justify-content-between align-items-center mb-5">
           <app-back-button class="mb-0"></app-back-button>
           <div class="stat-pill">
             <i class="bi bi-shield-check me-2"></i> VERIFIED PERSONNEL
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-10 col-xl-8">
            <div *ngIf="staff" class="glass-panel p-0 overflow-hidden shadow-2xl">
              
              <!-- Profile Header -->
              <div class="profile-hero p-4 p-md-5 border-bottom border-white border-opacity-10 position-relative">
                <div class="hero-glow"></div>
                <div class="row align-items-center position-relative">
                  <div class="col-auto">
                     <div class="avatar-quantum shadow-lg" [style.background]="getAvatarColor()">
                       {{ staff?.name?.charAt(0)?.toUpperCase() }}
                     </div>
                  </div>
                  <div class="col ps-md-4">
                    <div class="stat-pill d-inline-block mb-2" [style.color]="staff.role === 'Driver' ? '#fbbf24' : '#60a5fa'">
                       {{ staff.role.toUpperCase() }} DIVISION
                    </div>
                    <h1 class="quantum-title fw-bold text-white mb-0">{{ staff.name }}</h1>
                    <div class="d-flex gap-3 mt-3">
                       <div class="x-small text-white opacity-50"><i class="bi bi-geo-alt me-1"></i> Active Duty</div>
                       <div class="x-small text-white opacity-50"><i class="bi bi-calendar-check me-1"></i> Joined May 2023</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Body -->
              <div class="p-4 p-md-5">
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="info-cell p-4">
                      <label class="x-small text-white-50 text-uppercase tracking-widest mb-1 d-block">Communication Hub</label>
                      <div class="h5 fw-bold text-white mb-0">{{ staff.mobileNumber }}</div>
                      <div class="x-small opacity-30 mt-1">Verified Contact</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-cell p-4">
                      <label class="x-small text-white-50 text-uppercase tracking-widest mb-1 d-block">Personnel Age</label>
                      <div class="h5 fw-bold text-white mb-0">{{ staff.age }} Years</div>
                      <div class="x-small opacity-30 mt-1">Date of Birth: 19XX-XX-XX</div>
                    </div>
                  </div>

                  <div class="col-12 mt-4">
                    <div class="finance-panel p-4 p-md-5">
                      <div class="row align-items-center">
                        <div class="col">
                          <label class="x-small text-white opacity-50 text-uppercase tracking-widest mb-2 d-block">Outstanding Liquidity</label>
                          <div class="h1 fw-extrabold text-white mb-0">₹{{ staff.totalBalance | number:'1.2-2' }}</div>
                          <div class="x-small text-white-50 mt-1">Current payout balance in vault</div>
                        </div>
                        <div class="col-auto">
                          <div class="q-badge-profit p-3 px-4 fs-6" [class.success]="staff.totalBalance <= 0" [class.danger]="staff.totalBalance > 0">
                             {{ staff.totalBalance <= 0 ? 'SETTLED' : 'PENDING SETTLEMENT' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-5 pt-4 border-top border-white border-opacity-5 d-flex gap-3">
                   <button class="btn btn-quantum-primary px-4">
                      <i class="bi bi-pencil-square me-2"></i> Update Profile
                   </button>
                   <button class="btn btn-quantum-accent px-4 border-white border-opacity-20 bg-white bg-opacity-5">
                      <i class="bi bi-receipt me-2"></i> Salary Logs
                   </button>
                </div>
              </div>

            </div>

            <!-- States -->
            <div *ngIf="!staff && !error" class="glass-panel p-5 text-center">
              <div class="spinner-border text-primary opacity-50 mb-3"></div>
              <p class="text-white-50 small tracking-wider">RETRIEVING PERSONNEL DATA...</p>
            </div>

            <div *ngIf="error" class="glass-panel p-5 text-center border-danger border-opacity-20">
              <i class="bi bi-exclamation-octagon fs-1 text-danger opacity-50 mb-3 d-block"></i>
              <h5 class="text-white mb-2">Access Denied</h5>
              <p class="text-white-50 small mb-4">{{ error }}</p>
              <button (click)="loadStaff()" class="btn btn-quantum-primary">Force Reload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quantum-title { font-size: 2.75rem; letter-spacing: -1.5px; }

    .stat-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.35rem 1.1rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--q-primary);
    }

    .avatar-quantum {
      width: 100px; height: 100px;
      border-radius: 24px;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 3rem;
      border: 4px solid rgba(255, 255, 255, 0.1);
    }

    .hero-glow {
      position: absolute; top: -50%; left: -20%; width: 140%; height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .info-cell {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 18px;
      transition: all 0.3s ease;
    }
    .info-cell:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.1); }

    .finance-panel {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      box-shadow: inset 0 0 40px rgba(0,0,0,0.2);
    }

    .btn-icon-glass {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    .btn-icon-glass:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

    .x-small { font-size: 0.7rem; }
    .tracking-widest { letter-spacing: 0.15em; }
    .tracking-wider { letter-spacing: 0.05em; }
    .fw-extrabold { font-weight: 850; }
  `]
})
export class StaffDetailComponent implements OnInit {
  staff?: StaffMember;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    const role = this.route.snapshot.paramMap.get('role')?.toLowerCase();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (role === 'driver') {
      this.staffService.getDriverById(id).pipe(
        timeout(10000),
        catchError(err => throwError(() => err))
      ).subscribe({
        next: (data) => {
          this.staff = { ...data, role: 'Driver', totalBalance: data.walletBalance ?? 0 };
          if (data.name) this.calculateBalance(data.name);
        },
        error: () => this.error = 'Driver not found or access denied (Connection Timeout).'
      });
    } else if (role === 'conductor') {
      this.staffService.getConductorById(id).pipe(
        timeout(10000),
        catchError(err => throwError(() => err))
      ).subscribe({
        next: (data) => {
          this.staff = { ...data, role: 'Conductor', totalBalance: data.walletBalance ?? 0 };
          if (data.name) this.calculateBalance(data.name);
        },
        error: () => this.error = 'Conductor not found or access denied (Connection Timeout).'
      });
    } else if (role === 'cleaner') {
      this.staffService.getCleanerById(id).pipe(
        timeout(10000),
        catchError(err => throwError(() => err))
      ).subscribe({
        next: (data) => {
          this.staff = { ...data, role: 'Cleaner', totalBalance: data.walletBalance ?? 0 };
          if (data.name) this.calculateBalance(data.name);
        },
        error: () => this.error = 'Cleaner not found or access denied (Connection Timeout).'
      });
    } else {
      this.error = 'Unknown staff role specified.';
    }
  }

  getAvatarColor(): string {
    if (!this.staff) return 'gray';
    switch (this.staff.role) {
      case 'Driver': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'Conductor': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'Cleaner': return 'linear-gradient(135deg, #10b981, #059669)';
      default: return 'gray';
    }
  }

  private calculateBalance(name: string): void {
    this.staffService.staff$.subscribe(allStaff => {
      const match = allStaff.find(s => s.name === name);
      if (match && this.staff) {
        this.staff.totalBalance = match.totalBalance;
      }
    });
  }
}
