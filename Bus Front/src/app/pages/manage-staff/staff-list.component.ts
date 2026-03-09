import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner">
      <div class="container py-lg-5 animate__animated animate__fadeIn">
        <app-back-button></app-back-button>

        <!-- Header Section -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
          <div>
            <div class="stat-pill d-inline-flex mb-3">
              <i class="bi bi-people-fill me-2"></i> PERSONNEL MANAGEMENT
            </div>
            <h1 class="quantum-title fw-bold text-gradient-primary mb-1">Crew Directorate</h1>
            <p class="text-white opacity-50 small mb-0">Monitor staff credentials and pending financial balances</p>
          </div>
          <div class="d-flex gap-3">
            <a routerLink="/staff-registration" class="btn btn-quantum-primary px-4 py-2">
              <i class="bi bi-person-plus-fill me-2"></i> Register Staff
            </a>
          </div>
        </div>

        <!-- Drivers Section -->
        <div class="q-table-container mb-5 animate__animated animate__fadeInUp">
          <div class="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-white-50 text-uppercase tracking-widest small">Active Bus Drivers</h6>
            <div class="stat-pill">
              {{ drivers.length }} REGISTERED
            </div>
          </div>
          <div class="table-responsive">
            <table class="q-table m-0">
              <thead>
                <tr>
                  <th class="ps-4 w-40">Name</th>
                  <th class="w-30">Contact Hub</th>
                  <th class="text-end pe-4 w-30">Wallet Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let drv of drivers" class="q-tr-hover">
                  <td class="ps-4 w-40">
                    <div class="d-flex align-items-center gap-3">
                      <div class="icon-avatar bg-warning text-dark">
                        <i class="bi bi-person-fill"></i>
                      </div>
                      <div class="fw-bold text-white text-truncate">{{ drv.name }}</div>
                    </div>
                  </td>
                  <td class="w-30">
                    <div class="d-flex flex-column">
                      <span class="small text-white-50">Mobile</span>
                      <span class="fw-medium text-white">{{ drv.mobileNumber }}</span>
                    </div>
                  </td>
                  <td class="text-end pe-4 w-30">
                    <div class="d-flex flex-column align-items-end">
                      <span class="x-small text-uppercase opacity-40 mb-1">Outstanding</span>
                      <div class="h6 mb-0 fw-bold" [class.text-danger]="drv.totalBalance > 0" [class.text-success]="drv.totalBalance === 0">
                        ₹{{ drv.totalBalance | number: '1.2-2' }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="drivers.length === 0">
                  <td colspan="3" class="text-center py-5">
                    <div class="opacity-25 mb-2"><i class="bi bi-person-slash fs-1"></i></div>
                    <span class="text-white-50 x-small">No drivers detected in active database.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Conductors Section -->
        <div class="q-table-container mb-5 animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
          <div class="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-white-50 text-uppercase tracking-widest small">Active Conductors</h6>
            <div class="stat-pill accent">
              {{ conductors.length }} REGISTERED
            </div>
          </div>
          <div class="table-responsive">
            <table class="q-table m-0">
              <thead>
                <tr>
                  <th class="ps-4 w-40">Name</th>
                  <th class="w-30">Contact Hub</th>
                  <th class="text-end pe-4 w-30">Wallet Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cnd of conductors" class="q-tr-hover">
                  <td class="ps-4 w-40">
                    <div class="d-flex align-items-center gap-3">
                      <div class="icon-avatar bg-info text-white">
                        <i class="bi bi-person-badge-fill"></i>
                      </div>
                      <div class="fw-bold text-white text-truncate">{{ cnd.name }}</div>
                    </div>
                  </td>
                  <td class="w-30">
                    <div class="d-flex flex-column">
                      <span class="small text-white-50">Mobile</span>
                      <span class="fw-medium text-white">{{ cnd.mobileNumber }}</span>
                    </div>
                  </td>
                  <td class="text-end pe-4 w-30">
                    <div class="d-flex flex-column align-items-end">
                      <span class="x-small text-uppercase opacity-40 mb-1">Outstanding</span>
                      <div class="h6 mb-0 fw-bold" [class.text-danger]="cnd.totalBalance > 0" [class.text-success]="cnd.totalBalance === 0">
                        ₹{{ cnd.totalBalance | number: '1.2-2' }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="conductors.length === 0">
                  <td colspan="3" class="text-center py-5">
                    <div class="opacity-25 mb-2"><i class="bi bi-person-vcard fs-1"></i></div>
                    <span class="text-white-50 x-small">No conductors detected in active database.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cleaners Section -->
        <div class="q-table-container animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
          <div class="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-white-50 text-uppercase tracking-widest small">Active Team Cleaners</h6>
            <div class="stat-pill success">
              {{ cleaners.length }} REGISTERED
            </div>
          </div>
          <div class="table-responsive">
            <table class="q-table m-0">
              <thead>
                <tr>
                  <th class="ps-4 w-40">Name</th>
                  <th class="w-30">Contact Hub</th>
                  <th class="text-end pe-4 w-30">Wallet Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cl of cleaners" class="q-tr-hover">
                  <td class="ps-4 w-40">
                    <div class="d-flex align-items-center gap-3">
                      <div class="icon-avatar bg-success text-white">
                        <i class="bi bi-stars"></i>
                       </div>
                      <div class="fw-bold text-white text-truncate">{{ cl.name }}</div>
                    </div>
                  </td>
                  <td class="w-30">
                    <div class="d-flex flex-column">
                      <span class="small text-white-50">Mobile</span>
                      <span class="fw-medium text-white">{{ cl.mobileNumber }}</span>
                    </div>
                  </td>
                  <td class="text-end pe-4 w-30">
                    <div class="d-flex flex-column align-items-end">
                      <span class="x-small text-uppercase opacity-40 mb-1">Outstanding</span>
                      <div class="h6 mb-0 fw-bold" [class.text-danger]="cl.totalBalance > 0" [class.text-success]="cl.totalBalance === 0">
                        ₹{{ cl.totalBalance | number: '1.2-2' }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="cleaners.length === 0">
                  <td colspan="3" class="text-center py-4">
                    <span class="text-white-50 x-small">No cleaners detected in active database.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .quantum-title { font-size: 2.5rem; letter-spacing: -1px; }
    
    .stat-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.3rem 1rem;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--q-primary);
    }
    .stat-pill.accent { color: var(--q-accent); border-color: rgba(255, 122, 0, 0.2); }
    .stat-pill.success { color: var(--q-success); border-color: rgba(16, 185, 129, 0.2); }

    .icon-avatar {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      font-size: 1.1rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-icon-glass {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 10px;
      transition: all 0.2s ease;
    }
    .btn-icon-glass:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .x-small { font-size: 0.7rem; }
    .tracking-widest { letter-spacing: 0.15em; }
    .tracking-wider { letter-spacing: 0.05em; }

    /* Precision Alignment System */
    .w-40 { width: 40% !important; }
    .w-30 { width: 30% !important; }
    
    .q-table { table-layout: fixed; width: 100%; border-collapse: separate; border-spacing: 0 4px; }
    .q-table th { background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .q-tr-hover:hover { background: rgba(59, 130, 246, 0.04); }
  `]
})
export class StaffListComponent implements OnInit {
  staffMembers: StaffMember[] = [];

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.staffService.staff$.subscribe(data => {
      this.staffMembers = data;
    });
    this.staffService.refreshStaffList();
  }

  get drivers(): StaffMember[] {
    return this.staffMembers.filter(s => s.role === 'Driver');
  }

  get conductors(): StaffMember[] {
    return this.staffMembers.filter(s => s.role === 'Conductor');
  }

  get cleaners(): StaffMember[] {
    return this.staffMembers.filter(s => s.role === 'Cleaner');
  }
}
