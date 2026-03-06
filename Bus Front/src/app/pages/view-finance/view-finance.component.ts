import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { DailyFinance } from '../../core/models/finance.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-finance',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <!-- Page Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="fw-bold mb-0">Daily Reports List</h2>
              <p class="text-muted small mb-0">Detailed view of all financial transactions</p>
            </div>
            <div class="d-flex gap-2">
              <button (click)="loadRecords()" class="btn btn-outline-dark btn-sm px-3" [disabled]="loading">
                <i class="bi bi-arrow-clockwise me-1" [class.spin]="loading"></i> Refresh
              </button>
              <a routerLink="/add" class="btn btn-dark btn-sm px-3">
                <i class="bi bi-plus-lg me-1"></i> New Entry
              </a>
            </div>
          </div>

          <!-- Search Filter -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-2 px-3">
              <div class="row align-items-center g-2">
                <div class="col-auto"><i class="bi bi-search text-muted"></i></div>
                <div class="col">
                  <input type="text" class="form-control border-0 shadow-none" 
                         placeholder="Search by date, driver, or conductor..." 
                         (input)="onSearch($event)">
                </div>
              </div>
            </div>
          </div>

          <!-- Main Table Card -->
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-dark text-white">
                    <tr class="small text-uppercase fw-bold">
                      <th class="ps-3 py-3">Date</th>
                      <th>Driver Info</th>
                      <th>Conductor Info</th>
                      <th class="text-center">Diesel</th>
                      <th class="text-end">Expense</th>
                      <th class="text-end">Collection</th>
                      <th class="text-center">Net Balance</th>
                      <th class="text-center pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngIf="loading">
                      <td colspan="8" class="text-center py-5">
                        <div class="spinner-border spinner-border-sm text-dark" role="status"></div>
                        <p class="mt-2 text-muted small">Loading records...</p>
                      </td>
                    </tr>

                    <tr *ngFor="let record of filteredRecords; trackBy: trackById" [hidden]="loading" class="small">
                      <td class="ps-3 fw-bold">{{ record.date | date:'mediumDate' }}</td>
                      <td>
                        <div class="staff-info">
                          <span class="d-block fw-bold text-dark">{{ record.driverName }}</span>
                          <span class="d-block text-muted x-small">Paid: ₹{{ record.driverSalaryPaid }} | Bal: ₹{{ record.driverBalanceSalary }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="staff-info">
                          <span class="d-block fw-bold text-dark">{{ record.conductorName }}</span>
                          <span class="d-block text-muted x-small">Paid: ₹{{ record.conductorSalaryPaid }} | Bal: ₹{{ record.conductorBalanceSalary }}</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <span class="d-block fw-bold">{{ record.dieselLiters }}ℓ</span>
                        <span class="text-muted x-small">@ ₹{{ record.dieselPricePerLiter }}</span>
                      </td>
                      <td class="text-end fw-bold text-danger">
                        ₹{{ (record.totalCollection - (record.balance ?? 0)) | number:'1.0-0' }}
                      </td>
                      <td class="text-end fw-bold text-success">
                        ₹{{ record.totalCollection | number:'1.0-0' }}
                      </td>
                      <td class="text-center">
                        <span class="fw-bold px-2 py-1 rounded" 
                              [class.bg-success-subtle]="(record.balance ?? 0) >= 0"
                              [class.bg-danger-subtle]="(record.balance ?? 0) < 0"
                              [class.text-success]="(record.balance ?? 0) >= 0"
                              [class.text-danger]="(record.balance ?? 0) < 0">
                          ₹{{ (record.balance ?? 0) | number:'1.0-2' }}
                        </span>
                      </td>
                      <td class="text-center pe-3">
                        <div class="d-flex justify-content-center gap-1">
                           <a [routerLink]="['/report-view', record.id]" class="btn btn-sm btn-outline-primary py-0" title="View">
                             <i class="bi bi-eye"></i>
                           </a>
                           <a [routerLink]="['/edit-report', record.id]" class="btn btn-sm btn-outline-success py-0" title="Edit">
                             <i class="bi bi-pencil"></i>
                           </a>
                           <button (click)="onDelete(record.id!)" class="btn btn-sm btn-outline-danger py-0" title="Delete">
                             <i class="bi bi-trash"></i>
                           </button>
                        </div>
                      </td>
                    </tr>

                    <tr *ngIf="!loading && filteredRecords.length === 0">
                      <td colspan="8" class="text-center py-5 text-muted">No matching records found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer bg-white border-top-0 py-2">
              <small class="text-muted">Total Records: {{ filteredRecords.length }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .bg-success-subtle { background-color: #dcfce7 !important; }
    .bg-danger-subtle { background-color: #fee2e2 !important; }
    .text-success { color: #198754 !important; }
    .text-danger { color: #dc3545 !important; }
    .x-small { font-size: 0.75rem; }
    .staff-info { line-height: 1.2; }
  `]
})
export class ViewFinanceComponent implements OnInit {
  records: DailyFinance[] = [];
  filteredRecords: DailyFinance[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.errorMsg = '';

    this.financeService.getAllFinance().subscribe({
      next: (data: DailyFinance[]) => {
        this.records = data || [];
        this.filteredRecords = [...this.records];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Server connection failed';
        this.cdr.detectChanges();
      }
    });

    setTimeout(() => { if (this.loading) { this.loading = false; this.cdr.detectChanges(); } }, 8000);
  }

  onSearch(event: any): void {
    const term = event.target.value.toLowerCase().trim();
    if (!term) {
      this.filteredRecords = [...this.records];
    } else {
      this.filteredRecords = this.records.filter(r =>
        r.date?.toLowerCase().includes(term) ||
        r.driverName?.toLowerCase().includes(term) ||
        r.conductorName?.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }

  onDelete(id: number): void {
    if (confirm('Delete this financial record permanently?')) {
      this.financeService.deleteFinance(id).subscribe({
        next: () => this.loadRecords(),
        error: () => alert('Request denied by server')
      });
    }
  }

  trackById(index: number, item: DailyFinance): number {
    return item.id || index;
  }
}
