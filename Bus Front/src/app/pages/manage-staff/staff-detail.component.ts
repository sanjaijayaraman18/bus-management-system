import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { FinanceService } from '../../core/services/finance.service';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BackButtonComponent, FormsModule],
  template: `
    <div class="page-wrapper staff-detail-page bg-dark-navy">
      <div class="container py-lg-5 animate__animated animate__fadeIn">
        
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-5">
           <app-back-button class="mb-0"></app-back-button>
           <div class="d-flex gap-2" *ngIf="staffDetails && !loading">
             <button class="btn btn-vibrant btn-edit px-4" (click)="showEditModal = true">
                <i class="bi bi-pencil-square me-2"></i> Update Balance
             </button>
             <button class="btn btn-vibrant btn-delete px-4" (click)="onDelete()">
                <i class="bi bi-trash-fill me-2"></i> Delete Staff
             </button>
           </div>
        </div>

        <div class="row g-4" *ngIf="staffDetails && !loading">
          <!-- Left Column: Staff Profile -->
          <div class="col-xl-4">
            <div class="glass-card p-4 h-100 staff-profile-card border-0 shadow-lg">
               <div class="text-center mb-4">
                  <div class="avatar-detail mx-auto mb-3 shadow-lg" [style.background]="getAvatarColor()">
                    {{ staffDetails.name.charAt(0).toUpperCase() }}
                  </div>
                  <h2 class="text-white fw-900 mb-1">{{ staffDetails.name }}</h2>
                  <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 uppercase tracking-widest x-small border border-primary border-opacity-10">
                    {{ staffDetails.role }} Division
                  </span>
               </div>

               <div class="info-list gap-3 d-flex flex-column mt-5">
                  <div class="info-item p-3 rounded-3 bg-white bg-opacity-5 transition-all hover-lift">
                    <label class="x-small text-label uppercase tracking-widest mb-1 d-block opacity-50">Mobile Number</label>
                    <div class="fw-bold text-white">{{ staffDetails.mobileNumber }}</div>
                  </div>
                  <div class="info-item p-3 rounded-3 bg-white bg-opacity-5 transition-all hover-lift">
                    <label class="x-small text-label uppercase tracking-widest mb-1 d-block opacity-50">Assigned Route</label>
                    <div class="fw-bold text-white">{{ staffDetails.assignedRoute?.routeName || 'Not Assigned' }}</div>
                  </div>
                  <div class="info-item p-3 rounded-3 bg-white bg-opacity-5 transition-all hover-lift">
                    <label class="x-small text-label uppercase tracking-widest mb-1 d-block opacity-50">Fixed Salary</label>
                    <div class="fw-bold text-white">₹{{ staffDetails.fixedSalary || 0 | number }}</div>
                  </div>
               </div>

               <!-- Diesel Insight -->
               <div class="diesel-insight p-4 rounded-4 mt-5">
                  <div class="d-flex align-items-center gap-3 mb-3">
                     <div class="icon-box-sm bg-warning bg-opacity-10 text-warning rounded-3 fs-3 p-2">
                        <i class="bi bi-fuel-pump"></i>
                     </div>
                     <div>
                        <div class="x-small text-label uppercase tracking-widest opacity-50">Diesel estimation</div>
                        <div class="text-white fw-bold">Recent duty average</div>
                     </div>
                  </div>
                  <div class="h3 fw-900 text-warning mb-0">
                    ≈ {{ dieselEstimation | number:'1.1-1' }} <span class="fs-6 fw-bold">Liters</span>
                  </div>
                  <p class="x-small text-label mt-2 mb-0 opacity-40">Based on last 5 operational days</p>
               </div>
            </div>
          </div>

          <!-- Right Column: Balance & History -->
          <div class="col-xl-8">
            <div class="d-flex flex-column gap-4 h-100">
               <!-- Outstanding Balance Overview -->
               <div class="glass-card p-5 balance-hero-card border-0 shadow-lg text-center text-md-start">
                  <div class="row align-items-center g-4">
                    <div class="col-md">
                      <label class="text-label uppercase tracking-widest x-small mb-2 d-block opacity-60">Total Outstanding Balance</label>
                      <div class="display-3 fw-900 mb-0" [ngClass]="getBalanceTextColor(staffDetails.totalBalance)">
                        ₹{{ staffDetails.totalBalance | number }}
                      </div>
                    </div>
                    <div class="col-md-auto">
                      <div class="status-indicator text-center p-3 px-4 rounded-pill border border-white border-opacity-10" 
                           [ngClass]="staffDetails.totalBalance <= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'">
                        <div class="fw-bold uppercase tracking-widest x-small" [ngClass]="staffDetails.totalBalance <= 0 ? 'text-success' : 'text-danger'">
                           <i class="bi bi-info-circle me-1"></i>
                           {{ staffDetails.totalBalance <= 0 ? 'Account Settled' : 'Pending Settlement' }}
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               <!-- Balance History Table -->
               <div class="glass-card p-0 overflow-hidden border-0 shadow-lg flex-grow-1">
                  <div class="p-4 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-800 text-section uppercase tracking-widest">Balance History</h5>
                    <div class="badge bg-white bg-opacity-5 text-label py-2 px-3 rounded-pill border border-white border-opacity-5 x-small fw-800 uppercase tracking-widest">
                       RECENT RECORDS
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="q-table m-0">
                      <thead>
                        <tr>
                          <th class="ps-4">Date</th>
                          <th>Route</th>
                          <th class="text-end">Paid</th>
                          <th class="text-end">Balance</th>
                          <th class="text-end pe-4">Total Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let h of displayHistory; let i = index" class="q-tr-hover">
                          <td class="ps-4">
                             <div class="fw-bold text-white">{{ h.date | date:'dd MMM yyyy' }}</div>
                             <div class="x-small text-label opacity-40">Duty Record</div>
                          </td>
                          <td class="text-section">{{ h.routeName }}</td>
                          <td class="text-end text-success fw-bold">₹{{ h.salaryPaid | number }}</td>
                          <td class="text-end text-warning fw-bold">₹{{ h.balance | number }}</td>
                          <td class="text-end pe-4">
                             <span class="badge rounded-pill bg-white bg-opacity-5 text-white border border-white border-opacity-10 py-1 px-3">
                                ₹{{ getCumulativeBalanceAt(i) | number }}
                             </span>
                          </td>
                        </tr>
                        <!-- Initial Adjustment row if non-zero -->
                        <tr class="q-tr-hover opacity-75" *ngIf="staffDetails.walletBalance">
                           <td class="ps-4">
                              <div class="fw-bold text-white">Genesis</div>
                              <div class="x-small text-label opacity-40">Initial / Adjust</div>
                           </td>
                           <td class="text-section">Manual Setup</td>
                           <td class="text-end">-</td>
                           <td class="text-end text-warning fw-bold">₹{{ staffDetails.walletBalance | number }}</td>
                           <td class="text-end pe-4">
                             <span class="badge rounded-pill bg-white bg-opacity-10 text-white py-1 px-3">
                                ₹{{ staffDetails.walletBalance| number }}
                             </span>
                           </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div *ngIf="displayHistory.length === 0 && !staffDetails.walletBalance" class="text-center py-5 opacity-40">
                     <i class="bi bi-journal-x fs-1 mb-2 d-block"></i>
                     <p class="x-small uppercase tracking-widest fw-800">No financial history available for this staff</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-5">
           <div class="spinner-border text-primary opacity-50 mb-3"></div>
           <p class="text-white-50 small tracking-wider uppercase">Retrieving staff details...</p>
        </div>

        <!-- Empty / Error State -->
        <div *ngIf="!staffDetails && !loading" class="text-center py-5 animate__animated animate__fadeIn">
           <div class="glass-card p-5 border-danger border-opacity-10 bg-danger bg-opacity-5 mx-auto" style="max-width: 500px">
              <i class="bi bi-exclamation-octagon fs-1 text-danger opacity-50 mb-3 d-block"></i>
              <h5 class="text-white mb-2">Staff details not available</h5>
              <p class="text-label small mb-4 opacity-50">The requested record could not be found or a connection error occurred.</p>
              <button (click)="loadStaffData()" class="btn btn-vibrant btn-view px-4">
                 <i class="bi bi-arrow-clockwise me-2"></i> Retry Connection
              </button>
           </div>
        </div>

      </div>

      <!-- Edit Balance Modal -->
      <div class="modal-backdrop bg-black bg-opacity-70 animate__animated animate__fadeIn" *ngIf="showEditModal">
         <div class="modal d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
               <div class="glass-panel p-0 overflow-hidden shadow-2xl border-0 w-100">
                  <div class="p-4 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center">
                     <h5 class="mb-0 fw-800 text-white uppercase tracking-widest">Balance Adjustment</h5>
                     <button class="btn-close btn-close-white" (click)="showEditModal = false"></button>
                  </div>
                  <div class="p-4 p-lg-5">
                     <div class="mb-4">
                        <label class="x-small text-label uppercase tracking-widest mb-2 d-block opacity-60">Staff Member</label>
                        <div class="h4 text-white fw-bold mb-0 opacity-40">{{ staffDetails?.name }}</div>
                     </div>
                     <div class="mb-5">
                        <label class="x-small text-label uppercase tracking-widest mb-2 d-block opacity-60">Adjustment Amount (₹)</label>
                        <input type="number" [(ngModel)]="editBalance" class="form-control form-control-lg bg-input border-input text-white shadow-none" placeholder="Enter new adjustment amount...">
                        <p class="x-small text-label mt-2 opacity-40">This affects the base/starting balance only. Historical transactions remain unchanged.</p>
                     </div>
                     <div class="d-grid">
                        <button class="btn btn-quantum-primary btn-lg" (click)="saveBalance()">
                           <i class="bi bi-save2 me-2"></i> Save Adjustment
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .bg-dark-navy { background: #0f172a; min-height: 100vh; }
    .text-section { color: #e2e8f0; }
    .text-label { color: #cbd5e1; }
    .bg-input { background-color: #1e293b !important; }
    .border-input { border: 1px solid #334155 !important; }

    .avatar-detail {
       width: 120px; height: 120px;
       border-radius: 30px;
       display: flex; align-items: center; justify-content: center;
       font-size: 3.5rem; font-weight: 900; color: white;
       border: 6px solid rgba(255, 255, 255, 0.05);
    }

    .diesel-insight {
       background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.03) 100%);
       border: 1px solid rgba(245, 158, 11, 0.1);
       box-shadow: inset 0 0 40px rgba(0,0,0,0.1);
    }

    .balance-hero-card {
       background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
    }

    .hover-lift:hover { transform: translateX(8px); background: rgba(255, 255, 255, 0.08); }
    .transition-all { transition: all 0.3s ease; }

    .modal-backdrop { position: fixed; inset: 0; z-index: 1050; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }

    .uppercase { text-transform: uppercase; }
    .fw-900 { font-weight: 900; }
    .fw-800 { font-weight: 800; }
    .x-small { font-size: 0.7rem; }
    .tracking-widest { letter-spacing: 2px; }

    .text-success { color: #22c55e !important; }
    .text-warning { color: #f59e0b !important; }
    .text-danger { color: #ef4444 !important; }
  `]
})
export class StaffDetailComponent implements OnInit {
  staffDetails?: StaffMember;
  displayHistory: any[] = [];
  dieselEstimation: number = 0;
  
  showEditModal: boolean = false;
  editBalance: number = 0;

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffService,
    private financeService: FinanceService
  ) { }

  ngOnInit(): void {
    this.loadStaffData();
  }

  loadStaffData(): void {
    const role = this.route.snapshot.paramMap.get('role');
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!role || !id) return;

    this.loading = true;
    this.staffService.getStaffDetails(role, id).subscribe({
      next: (data: any) => {
        // Capitalize role for UI display
        const displayRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        this.staffDetails = { ...data, role: displayRole as any };
        this.editBalance = data.walletBalance || 0;
        
        // Secondary data loads
        this.loadHistory();
        this.loadDieselEstimation();
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading staff details', err);
        this.staffDetails = undefined;
        this.loading = false;
      }
    });
  }

  loadHistory(): void {
    if (!this.staffDetails) return;
    this.staffService.getStaffHistory(this.staffDetails.name, this.staffDetails.role).subscribe(hist => {
      this.displayHistory = hist;
    });
  }

  loadDieselEstimation(): void {
    if (!this.staffDetails) return;
    this.staffService.getDieselEstimation(this.staffDetails.name, this.staffDetails.role).subscribe(est => {
      this.dieselEstimation = est;
    });
  }

  getCumulativeBalanceAt(index: number): number {
    if (!this.staffDetails) return 0;
    const base = this.staffDetails.walletBalance || 0;
    let sum = base;
    for (let i = this.displayHistory.length - 1; i >= index; i--) {
      sum += (this.displayHistory[i].balance || 0);
    }
    return sum;
  }

  getAvatarColor(): string {
    if (!this.staffDetails) return 'gray';
    switch (this.staffDetails.role) {
      case 'Driver': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'Conductor': return 'linear-gradient(135deg, #06b6d4, #0891b2)';
      case 'Cleaner': return 'linear-gradient(135deg, #10b981, #059669)';
      default: return 'gray';
    }
  }

  getBalanceTextColor(balance: number): string {
    if (balance === 0) return 'text-success';
    if (balance <= 500) return 'text-warning';
    return 'text-danger';
  }

  saveBalance(): void {
    if (!this.staffDetails || this.staffDetails.id === undefined) return;
    const roleFromUrl = this.route.snapshot.paramMap.get('role');
    if (!roleFromUrl) return;

    this.staffService.updateStaffBalance(roleFromUrl, this.staffDetails.id, this.editBalance).subscribe({
      next: () => {
        this.showEditModal = false;
        this.loadStaffData();
      },
      error: (err) => {
        console.error('Error updating balance', err);
        alert('Failed to update balance. Please try again.');
      }
    });
  }

  onDelete(): void {
    if (!this.staffDetails || this.staffDetails.id === undefined) return;
    const roleFromUrl = this.route.snapshot.paramMap.get('role');
    if (!roleFromUrl) return;

    if (confirm(`Are you sure you want to delete this staff member? This action cannot be undone.`)) {
      this.staffService.deleteStaff(roleFromUrl, this.staffDetails.id).subscribe({
        next: () => {
          this.router.navigate(['/staff-reports']);
        },
        error: (err) => {
          console.error('Error deleting staff', err);
          alert('Failed to delete staff member.');
        }
      });
    }
  }
}
