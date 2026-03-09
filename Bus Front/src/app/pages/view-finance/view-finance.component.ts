import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { RouteService, Route } from '../../core/services/route.service';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-view-finance',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent, FormsModule],
  template: `
    <div class="page-wrapper dashboard-inner">
      <div class="dashboard-inner-container animate__animated animate__fadeIn">
        <app-back-button></app-back-button>
        
        <!-- Header Section -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
               <span class="history-pill"><i class="bi bi-clock-history me-1"></i> ARCHIVES</span>
               <span class="count-pill">{{ filteredReports.length }} Records Found</span>
            </div>
            <h2 class="quantum-title-md fw-bold text-gradient-primary mb-1">Financial History</h2>
            <p class="text-white-50 small mb-0">Review daily performance and operational profitability trends</p>
          </div>
          <div class="d-flex gap-2">
             <button class="btn btn-glass-sm px-4" (click)="loadReports()" [disabled]="loading">
                <i class="bi bi-arrow-clockwise me-2" [class.spinner-border-sm]="loading"></i> Refresh
             </button>
             <a routerLink="/add" class="btn btn-quantum-accent px-4 py-2">
               <i class="bi bi-plus-lg me-2"></i> New Report
             </a>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-glass-bar mb-4 p-3 animate__animated animate__fadeInDown">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="q-label-xs opacity-50 mb-1">Filter by Date</label>
              <div class="input-group">
                <span class="input-group-text q-symbol-filter"><i class="bi bi-calendar-event"></i></span>
                <input type="date" class="form-control q-input-filter" [(ngModel)]="filterDate" (change)="onFilterChange()">
              </div>
            </div>
            <div class="col-md-4">
              <label class="q-label-xs opacity-50 mb-1">Filter by Route</label>
              <div class="input-group">
                <span class="input-group-text q-symbol-filter"><i class="bi bi-geo-alt"></i></span>
                <select class="form-select q-input-filter" [(ngModel)]="filterRouteId" (change)="onFilterChange()">
                  <option value="">-- All Routes --</option>
                  <option *ngFor="let route of routesList" [value]="route.id">{{ route.routeName }}</option>
                </select>
              </div>
            </div>
            <div class="col-md-5 d-flex justify-content-md-end gap-2">
              <button class="btn btn-glass-filter px-4" (click)="resetFilters()" [disabled]="!filterDate && !filterRouteId">
                <i class="bi bi-x-circle me-2"></i> Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Absolutely Centered & Balanced Table Card -->
        <div class="q-table-card animate__animated animate__fadeInUp">
          <div class="table-responsive">
            <table class="q-table-refined">
              <thead>
                <tr>
                  <th class="col-trip">Trip Details</th>
                  <th class="col-route">Route Name</th>
                  <th class="col-salary">Labour Salary</th>
                  <th class="col-collections">Today Collections</th>
                  <th class="col-diesel">Diesel Cost</th>
                  <th class="col-profit">Net Profit</th>
                  <th class="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of paginatedReports" class="q-row-hover">
                  <!-- Date (Centered) -->
                  <td class="py-3">
                    <div class="d-flex align-items-center justify-content-center gap-3">
                       <div class="mini-date-badge">
                          <span class="day">{{ r.date | date:'dd' }}</span>
                          <span class="month">{{ r.date | date:'MMM' }}</span>
                       </div>
                       <div class="text-start">
                          <div class="fw-bold text-white small">{{ r.date | date:'EEEE' }}</div>
                          <div class="x-small-text opacity-40">{{ r.date | date:'yyyy' }}</div>
                       </div>
                    </div>
                  </td>

                  <!-- Route (Centered) -->
                  <td>
                    <div class="d-flex align-items-center justify-content-center">
                       <i class="bi bi-geo-alt-fill text-accent-dim me-2"></i>
                       <span class="fw-bold text-white small letter-tight">{{ r.route?.routeName || 'REGULAR SERVICE' }}</span>
                    </div>
                  </td>

                  <!-- Grid-Aligned Labour Salary -->
                  <td>
                    <div class="salary-grid-container">
                       <div class="salary-grid-row driver">
                          <span class="role text-uppercase">Driver</span>
                          <span class="colon">:</span>
                          <span class="name text-truncate">{{ r.driverName }}</span>
                          <span class="pipe">|</span>
                          <span class="data">Paid <b>₹{{ r.driverSalaryPaid }}</b></span>
                          <span class="pipe">|</span>
                          <span class="data">Bal <b [class.text-warning]="(r.driverBalanceSalary ?? 0) > 0">₹{{ r.driverBalanceSalary }}</b></span>
                       </div>
                       <div class="salary-grid-row conductor">
                          <span class="role text-uppercase">Conductor</span>
                          <span class="colon">:</span>
                          <span class="name text-truncate">{{ r.conductorName }}</span>
                          <span class="pipe">|</span>
                          <span class="data">Paid <b>₹{{ r.conductorSalaryPaid }}</b></span>
                          <span class="pipe">|</span>
                          <span class="data">Bal <b [class.text-info]="(r.conductorBalanceSalary ?? 0) > 0">₹{{ r.conductorBalanceSalary }}</b></span>
                       </div>
                       <div class="salary-grid-row cleaner">
                          <span class="role text-uppercase">Cleaner</span>
                          <span class="colon">:</span>
                          <span class="name text-truncate">{{ r.cleanerName }}</span>
                          <span class="pipe">|</span>
                          <span class="data">Paid <b>₹{{ r.cleanerPadi }}</b></span>
                          <span class="pipe">|</span>
                          <span class="data">Bal <b [class.text-success]="(r.cleanerBalanceSalary ?? 0) > 0">₹{{ r.cleanerBalanceSalary }}</b></span>
                       </div>
                    </div>
                  </td>

                  <!-- Collections (Centered) -->
                  <td>
                    <div class="highlight-val text-white">₹{{ r.totalCollection | number:'1.0-0' }}</div>
                  </td>

                  <!-- Diesel (Centered) -->
                  <td>
                    <div class="highlight-val text-accent">₹{{ r.dieselExpense | number:'1.0-0' }}</div>
                  </td>

                  <!-- Profit (Centered) -->
                  <td>
                    <div class="profit-val" [class.success]="r.balance >= 0" [class.danger]="r.balance < 0">
                       ₹{{ r.balance | number:'1.0-0' }}
                    </div>
                  </td>

                  <!-- Circular Action Buttons (Centered) -->
                  <td>
                    <div class="d-flex justify-content-center gap-3">
                       <button class="btn btn-circular" [routerLink]="['/report-view', r.id]" title="View Full Analysis">
                          <i class="bi bi-eye"></i>
                       </button>
                       <button class="btn btn-circular accent" [routerLink]="['/edit-report', r.id]" title="Edit Daily Entry">
                          <i class="bi bi-pencil-square"></i>
                       </button>
                       <button class="btn btn-circular danger" (click)="onDelete(r.id)" title="Delete Financial Record">
                          <i class="bi bi-trash3-fill"></i>
                       </button>
                    </div>
                  </td>
                </tr>
                
                <!-- Zero State -->
                <tr *ngIf="filteredReports.length === 0 && !loading">
                  <td colspan="7" class="text-center py-5">
                    <div class="mb-3 opacity-20">
                       <i class="bi bi-folder-x fs-1"></i>
                    </div>
                    <h5 class="text-white opacity-40">No records found</h5>
                    <p class="text-white-50 x-small-text">Try adjusting your filters or refresh the list</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination Footer (DataTables Style) -->
          <div class="pagination-footer d-flex flex-column flex-md-row justify-content-between align-items-center p-3 gap-3" *ngIf="filteredReports.length > 0">
            <!-- Left: Display Info -->
            <div class="x-small-text opacity-50 order-2 order-md-1">{{ displayInfo }}</div>
            
            <!-- Center: Show Entries Selection -->
            <div class="d-flex align-items-center gap-2 order-1 order-md-2">
              <span class="x-small-text opacity-50">Show</span>
              <select class="form-select form-select-sm select-quantum" [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
              </select>
              <span class="x-small-text opacity-50">entries</span>
            </div>

            <!-- Right: Page Navigation -->
            <nav aria-label="Page navigation" class="order-3">
              <ul class="pagination pagination-sm mb-0 gap-1">
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <button class="page-link" (click)="changePage(currentPage - 1)">Previous</button>
                </li>
                
                <li class="page-item" *ngFor="let page of pagesArray" [class.active]="page === currentPage">
                  <button class="page-link" (click)="changePage(page)">{{ page }}</button>
                </li>
                
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <button class="page-link" (click)="changePage(currentPage + 1)">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-between align-items-center opacity-30">
           <div class="x-small-text fw-bold tracking-widest text-uppercase">Bus Central Core v3.0</div>
           <div class="x-small-text">SYSTEM SECURED | INR CURRENCY</div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-inner { padding: 2rem 1rem; }
    .dashboard-inner-container { max-width: 1400px; margin: 0 auto; padding: 0 1rem; }

    /* Filter Bar Styling */
    .filter-glass-bar {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
    }
    .q-input-filter {
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      color: #fff !important;
      font-size: 0.8rem !important;
      border-radius: 0 10px 10px 0 !important;
      padding: 0.4rem 0.75rem !important;
    }
    .q-symbol-filter {
      background: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-right: none !important;
      color: var(--q-primary) !important;
      font-size: 0.8rem !important;
      border-radius: 10px 0 0 10px !important;
      width: 38px;
      justify-content: center;
    }
    .btn-glass-filter {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 10px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
    }
    .btn-glass-filter:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    /* Absolute Stable Layout Architecture */
    .q-table-refined { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
    .col-trip { width: 14%; }
    .col-route { width: 12%; }
    .col-salary { width: 33%; }
    .col-collections { width: 12%; }
    .col-diesel { width: 10%; }
    .col-profit { width: 11%; }
    .col-actions { width: 8%; }

    /* Universal Centered Alignment */
    .q-table-refined thead th, 
    .q-table-refined tbody td { 
        text-align: center; 
        vertical-align: middle; 
        padding: 1.25rem 0.5rem;
    }

    .q-table-card {
      background: var(--q-glass);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }

    .q-table-refined thead th {
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        font-family: 'Outfit', sans-serif;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.35);
    }

    .q-row-hover { transition: background 0.2s ease; }
    .q-row-hover:hover { background: rgba(255, 255, 255, 0.02); }
    .q-row-hover td { border-bottom: 1px solid rgba(255, 255, 255, 0.03); }

    .mini-date-badge {
      width: 40px; height: 40px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      line-height: 1; flex-shrink: 0;
    }
    .mini-date-badge .day { font-weight: 800; font-size: 0.9rem; color: #fff; }
    .mini-date-badge .month { font-size: 0.5rem; text-transform: uppercase; font-weight: 700; color: var(--q-accent); }

    /* Tabular Aligned Salary Grid */
    .salary-grid-container { display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: 'Inter', sans-serif; }
    .salary-grid-row { 
        display: grid; 
        grid-template-columns: 75px 10px 80px 15px 85px 15px 85px; 
        align-items: center; 
        font-size: 0.72rem; 
        line-height: 1.4;
        color: rgba(255,255,255,0.4);
    }
    .salary-grid-row .role { font-weight: 800; text-align: left; font-size: 0.62rem; letter-spacing: 0.5px; opacity: 0.7; }
    .salary-grid-row .pipe { color: rgba(255,255,255,0.08); text-align: center; }
    .salary-grid-row .name { color: #fff; font-weight: 600; text-align: left; }
    .salary-grid-row .data { text-align: left; }
    .salary-grid-row .data b { color: rgba(255,255,255,0.8); font-weight: 700; }
    .salary-grid-row .colon { opacity: 0.2; text-align: center; }

    .driver .role { color: #ffc107; }
    .conductor .role { color: #0dcaf0; }
    .cleaner .role { color: #198754; }

    .highlight-val { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; }
    .profit-val { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; }
    .profit-val.success { color: var(--q-success); }
    .profit-val.danger { color: var(--q-danger); }

    /* Circular Action Buttons */
    .btn-circular {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255,255,255,0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 0.9rem; padding: 0;
    }
    .btn-circular:hover { 
        background: var(--q-primary); 
        color: #fff; 
        border-color: var(--q-primary); 
        transform: translateY(-2px) scale(1.1); 
        box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.3);
    }
    .btn-circular.accent:hover { 
        background: var(--q-accent); 
        border-color: var(--q-accent);
        box-shadow: 0 4px 12px rgba(var(--q-accent-rgb), 0.3);
    }
    .btn-circular.danger { color: rgba(239, 68, 68, 0.5); }
    .btn-circular.danger:hover { 
        background: var(--q-danger); 
        color: #fff; 
        border-color: var(--q-danger);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .quantum-title-md { font-family: 'Outfit', sans-serif; font-size: 1.75rem; letter-spacing: -0.5px; }
    .btn-glass-sm { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.8rem; padding: 0.4rem 1rem; border-radius: 8px; }
    .x-small-text { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .history-pill { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.15rem 0.6rem; border-radius: 4px; font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.3); }
    .count-pill { font-size: 0.6rem; font-weight: 700; color: var(--q-primary); text-transform: uppercase; }

    /* Pagination Styling */
    .pagination-footer { background: rgba(255, 255, 255, 0.015); border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .select-quantum { 
        background-color: rgba(255,255,255,0.05) !important; 
        color: #fff !important; 
        border: 1px solid rgba(255,255,255,0.1) !important; 
        border-radius: 8px !important; 
        width: auto !important;
        font-size: 0.75rem !important;
        padding: 0.2rem 2rem 0.2rem 0.75rem !important;
    }
    .pagination .page-link {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.5);
        border-radius: 8px !important;
        padding: 0.35rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    .pagination .page-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
    }
    .pagination .page-item.active .page-link {
        background: var(--q-primary);
        color: #fff;
        border-color: var(--q-primary);
        box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.3);
    }
    .pagination .page-item.disabled .page-link {
        background: transparent;
        opacity: 0.2;
        color: #fff;
    }
  `]
})
export class ViewFinanceComponent implements OnInit {
  reports: any[] = [];
  routesList: Route[] = [];
  loading = false;

  // Filter State
  filterDate: string = '';
  filterRouteId: string = '';

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 30];

  constructor(
    private financeService: FinanceService,
    private routeService: RouteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.loadRoutes();
  }

  loadReports(): void {
    this.loading = true;
    this.financeService.getAllFinance().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.reports = [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
          // Reset filters and page on fresh reload if needed, 
          // but usually we just want to refresh the data
          this.currentPage = 1;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load reports:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.routesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load routes:', err)
    });
  }

  // Filtering Logic
  get filteredReports(): any[] {
    return this.reports.filter(r => {
      let matchesDate = true;
      let matchesRoute = true;

      if (this.filterDate) {
        // Compare dates (ignoring time if applicable)
        const recordDate = new Date(r.date).toISOString().split('T')[0];
        matchesDate = recordDate === this.filterDate;
      }

      if (this.filterRouteId) {
        matchesRoute = r.route?.id?.toString() === this.filterRouteId;
      }

      return matchesDate && matchesRoute;
    });
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.filterDate = '';
    this.filterRouteId = '';
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  // Pagination Helpers
  get paginatedReports(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredReports.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReports.length / this.pageSize);
  }

  get pagesArray(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get displayInfo(): string {
    const total = this.filteredReports.length;
    if (total === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page
    this.cdr.detectChanges();
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this financial record? This action cannot be undone.')) {
      this.loading = true;
      this.financeService.deleteFinance(id).subscribe({
        next: () => {
          this.loadReports();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.loading = false;
          alert('Failed to delete the record. Please try again.');
          this.cdr.detectChanges();
        }
      });
    }
  }
}
