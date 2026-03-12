import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-wrapper staff-reports-page bg-dark-navy animate__animated animate__fadeIn">
      <div class="container py-lg-5">
        
        <!-- Premium Header -->
        <div class="mb-5 animate__animated animate__fadeInDown text-center text-lg-start">
           <div class="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-2">
              <span class="badge bg-primary bg-opacity-10 text-primary small fw-bold px-3 py-2 rounded-pill border border-primary border-opacity-10 tracking-widest uppercase">
                <i class="bi bi-person-badge-fill me-1"></i> Staff Intelligence Hub
              </span>
           </div>
           <h1 class="text-white fw-900 mb-2 display-5 tracking-tight">Staff <span class="text-gradient-accent">Reports</span></h1>
           <p class="text-label small-text fw-500 m-0 opacity-75">Analytics, balance monitoring, and personnel management console</p>
        </div>

        <!-- Summary Statistics Grid -->
        <div class="row g-4 mb-5">
          <div class="col-xl-3 col-md-6" *ngFor="let stat of summaryStats">
            <div class="glass-card p-4 h-100 border-top border-4" [ngStyle]="{'border-color': stat.color}">
               <div class="d-flex justify-content-between align-items-center">
                  <div>
                     <p class="text-label x-small fw-800 text-uppercase tracking-widest mb-1">{{ stat.label }}</p>
                     <h2 class="fw-900 mb-0 text-white">
                        <span *ngIf="stat.prefix" class="text-label opacity-50 me-1">{{ stat.prefix }}</span>{{ stat.value | number }}
                     </h2>
                  </div>
                  <div class="stat-icon-glow" [ngStyle]="{'--icon-color': stat.color}">
                     <i [class]="stat.icon"></i>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Search & Control Center -->
        <div class="glass-panel p-4 mb-5 shadow-lg">
           <div class="row g-4 align-items-center">
              <div class="col-lg-5">
                 <div class="search-hub position-relative">
                    <i class="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-3 text-label"></i>
                    <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" 
                           placeholder="Search staff by name or mobile number..." 
                           class="form-control form-control-lg border-input bg-input ps-5 rounded-pill text-white shadow-none">
                 </div>
              </div>
              
              <div class="col-lg-7 d-flex flex-wrap align-items-center gap-2 justify-content-lg-end">
                 <div class="filter-pill-group d-flex gap-1 bg-black bg-opacity-20 p-1 rounded-pill">
                    <button *ngFor="let f of filters" 
                            (click)="activeFilter = f; applyFilters()" 
                            [class.active]="activeFilter === f"
                            class="btn btn-sm rounded-pill px-3 fw-bold tracking-wider filter-pill">
                      {{ f }}
                    </button>
                 </div>
                 
                 <div class="divider-v mx-2 d-none d-md-block"></div>
                 
                 <div class="form-check form-switch custom-switch mb-0">
                    <input class="form-check-input pointer" type="checkbox" id="balanceToggle" [(ngModel)]="showOnlyOutstanding" (change)="onSearchChange()">
                    <label class="form-check-label x-small fw-800 text-uppercase tracking-widest ms-2 text-label pointer" for="balanceToggle">Outstanding Only</label>
                 </div>
              </div>
           </div>
        </div>

        <!-- Role-Based Staff Sections -->
        <div class="staff-sections">
           <div class="section-block mb-5" *ngFor="let group of staffGroups">
             <!-- Section Header -->
             <div class="d-flex align-items-center gap-3 mb-4">
                <h5 class="mb-0 fw-800 text-section text-uppercase tracking-widest">{{ group.title }}</h5>
                <div class="flex-grow-1 header-line-styled"></div>
                <div class="badge rounded-pill bg-white bg-opacity-5 text-label px-4 border border-white border-opacity-5 py-2 fw-800 x-small">
                   {{ group.items.length }} TOTAL
                </div>
             </div>

             <!-- Staff Grid (Responsive 3-2-1) -->
             <div class="row g-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
                <div class="col" *ngFor="let staff of group.items">
                   <div class="staff-card-modern h-100 d-flex flex-column">
                      <!-- Card Header -->
                      <div class="d-flex align-items-center gap-3 mb-4">
                         <div class="role-avatar shadow-sm" [ngStyle]="{'background': getAvatarColor(staff.role)}">
                            {{ staff.name.substring(0,1).toUpperCase() }}
                         </div>
                         <div class="overflow-hidden">
                            <h5 class="mb-0 fw-800 text-white text-truncate">{{ staff.name }}</h5>
                            <div class="d-flex align-items-center gap-2 mt-1">
                               <i class="bi bi-telephone text-label x-small"></i>
                               <span class="x-small text-label fw-600">{{ staff.mobileNumber }}</span>
                            </div>
                         </div>
                      </div>

                      <!-- Balance Stats -->
                      <div class="bg-black bg-opacity-10 rounded-2 title-3 p-3 mb-4 mt-auto">
                         <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="x-small text-label fw-800 uppercase tracking-widest">Outstanding Balance</span>
                            <div class="status-dot-lg" [ngClass]="getBalanceStatusClass(staff.totalBalance)"></div>
                         </div>
                         <h3 class="mb-0 fw-900" [ngClass]="getBalanceTextColor(staff.totalBalance)">
                            ₹{{ staff.totalBalance | number }}
                         </h3>
                      </div>

                       <!-- Action Grid -->
                       <div class="mt-4">
                          <button class="btn-delete-staff w-100 py-2 d-flex align-items-center justify-content-center gap-2" (click)="$event.stopPropagation(); deleteStaff(staff)">
                             <i class="bi bi-trash3-fill"></i> Delete Staff
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
 
              <!-- Empty State -->
              <div *ngIf="group.items.length === 0" class="text-center py-5 glass-card opacity-50 rounded-4">
                 <div class="empty-icon-box mb-3">
                    <i class="bi bi-person-slash text-label"></i>
                 </div>
                 <p class="x-small fw-800 text-uppercase tracking-widest text-label">No staff available</p>
              </div>
            </div>
         </div>

      </div>
    </div>
  `,
  styles: [`
    .staff-reports-page {
      background: transparent;
      padding-bottom: 5rem;
    }

    .bg-dark-navy { background: var(--q-bg); }
    .text-section { color: var(--text-section); }
    .text-label { color: var(--text-label); }
    .bg-input { background-color: var(--input-bg) !important; }
    .border-input { border: 1px solid var(--input-border) !important; }

    .uppercase { text-transform: uppercase; }
    .fw-900 { font-weight: 900; }
    .fw-800 { font-weight: 800; }
    .x-small { font-size: 0.7rem; }
    .tracking-widest { letter-spacing: 2px; }
    
    .stat-icon-glow {
       width: 48px; height: 48px;
       border-radius: 12px;
       display: flex; align-items: center; justify-content: center;
       font-size: 1.5rem;
       background: rgba(var(--icon-color), 0.1);
       color: var(--icon-color);
       box-shadow: 0 0 20px rgba(var(--icon-color), 0.2);
    }

    .filter-pill {
       color: var(--text-label);
       border: none;
       transition: all 0.3s;
    }
    .filter-pill:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .filter-pill.active {
       background: #fff;
       color: var(--q-bg);
       box-shadow: 0 4px 15px rgba(255,255,255,0.2);
    }

    .header-line-styled {
       height: 1px;
       background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    }

    .role-avatar {
       width: 48px; height: 48px;
       border-radius: 14px;
       display: flex; align-items: center; justify-content: center;
       font-weight: 800; color: white;
       font-size: 1.25rem;
    }

    .custom-switch .form-check-input {
       width: 3rem;
       height: 1.5rem;
       background-color: rgba(255,255,255,0.1);
       border-color: rgba(255,255,255,0.2);
       cursor: pointer;
    }
    .custom-switch .form-check-input:checked {
       background-color: var(--q-primary);
       border-color: var(--q-primary);
    }

    .divider-v { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }
    
    .empty-icon-box {
       font-size: 3rem;
       opacity: 0.3;
       display: inline-block;
    }

    .pointer { cursor: pointer; }

    .text-success { color: var(--status-clear) !important; }
    .text-warning { color: var(--status-medium) !important; }
    .text-danger { color: var(--status-high) !important; }

    .btn-delete-staff {
       background: rgba(239, 68, 68, 0.1);
       color: #ef4444;
       border: 1px solid rgba(239, 68, 68, 0.2);
       border-radius: 12px;
       font-weight: 800;
       font-size: 0.75rem;
       text-transform: uppercase;
       letter-spacing: 1px;
       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-delete-staff:hover {
       background: #ef4444;
       color: white;
       box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
       transform: translateY(-2px);
    }
    .btn-delete-staff:active {
       transform: translateY(0);
    }
    .btn-delete-staff i {
       font-size: 1rem;
    }
  `]
})
export class StaffReportsComponent implements OnInit, OnDestroy {
  allStaff: StaffMember[] = [];
  filteredStaff: StaffMember[] = [];
  searchQuery: string = '';
  activeFilter: string = 'All Staff';
  filters = ['All Staff', 'Drivers', 'Conductors', 'Cleaners'];
  showOnlyOutstanding: boolean = false;

  summaryStats = [
    { label: 'Total Drivers', value: 0, icon: 'bi bi-steering', color: '#3b82f6', prefix: '' },
    { label: 'Total Conductors', value: 0, icon: 'bi bi-ticket-perforated', color: '#06b6d4', prefix: '' },
    { label: 'Total Cleaners', value: 0, icon: 'bi bi-stars', color: '#10b981', prefix: '' },
    { label: 'Outstanding Balance', value: 0, icon: 'bi bi-wallet2', color: '#f59e0b', prefix: '₹' }
  ];

  staffGroups: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private staffService: StaffService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.staffService.staff$.subscribe(staff => {
        this.allStaff = staff;
        this.applyFilters();
      })
    );
    this.staffService.refreshStaffList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allStaff];

    // Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.mobileNumber.includes(q)
      );
    }

    // Role Filter
    if (this.activeFilter !== 'All Staff') {
      const role = this.activeFilter.substring(0, this.activeFilter.length - 1); // Remove 's'
      result = result.filter(s => s.role === role);
    }

    // Outstanding Balance Filter
    if (this.showOnlyOutstanding) {
      result = result.filter(s => s.totalBalance > 0);
    }

    this.filteredStaff = result;
    this.updateStats();
    this.groupStaff();
  }

  groupStaff(): void {
    this.staffGroups = [
      { id: 'drivers', title: 'Active Bus Drivers', items: this.filteredStaff.filter(s => s.role === 'Driver') },
      { id: 'conductors', title: 'Active Conductors', items: this.filteredStaff.filter(s => s.role === 'Conductor') },
      { id: 'cleaners', title: 'Active Team Cleaners', items: this.filteredStaff.filter(s => s.role === 'Cleaner') }
    ];
  }

  updateStats(): void {
    this.summaryStats[0].value = this.allStaff.filter(s => s.role === 'Driver').length;
    this.summaryStats[1].value = this.allStaff.filter(s => s.role === 'Conductor').length;
    this.summaryStats[2].value = this.allStaff.filter(s => s.role === 'Cleaner').length;
    this.summaryStats[3].value = this.allStaff.reduce((acc, curr) => acc + (curr.totalBalance || 0), 0);
  }

  getAvatarColor(role: string): string {
    switch (role) {
      case 'Driver': return '#3b82f6';
      case 'Conductor': return '#06b6d4';
      case 'Cleaner': return '#10b981';
      default: return '#64748b';
    }
  }

  getBalanceStatusClass(balance: number): string {
    if (balance === 0) return 'status-clear';
    if (balance <= 500) return 'status-medium';
    return 'status-high';
  }

  getBalanceTextColor(balance: number): string {
    if (balance === 0) return 'text-success';
    if (balance <= 500) return 'text-warning';
    return 'text-danger';
  }

  viewStaffDetails(staff: StaffMember): void {
    this.router.navigate(['/staff-view', staff.role.toLowerCase(), staff.id]);
  }

  editStaff(staff: StaffMember): void {
    this.router.navigate(['/staff-view', staff.role.toLowerCase(), staff.id]);
    // The detail page handles editing
  }

  deleteStaff(staff: StaffMember): void {
    if (!staff.id) return;
    
    // Custom Confirmation Popup
    if (confirm("Are you sure you want to delete this staff member?")) {
      this.staffService.deleteStaff(staff.role, staff.id).subscribe({
        next: () => {
          // Success: staffService.refreshStaffList() is called inside deleteStaff service method
          // The UI will automatically update because we are subscribed to staff$ in ngOnInit
        },
        error: (err) => {
          console.error('Error deleting staff:', err);
          alert('Failed to delete staff member. Please try again.');
        }
      });
    }
  }

  viewHistory(staff: StaffMember): void {
    this.router.navigate(['/staff-view', staff.role.toLowerCase(), staff.id]);
  }
}
