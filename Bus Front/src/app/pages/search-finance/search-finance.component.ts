import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { DailyFinance } from '../../core/models/finance.model';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-search-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner">
      <div class="container py-lg-5 animate__animated animate__fadeIn">
        <app-back-button></app-back-button>

        <!-- Header -->
        <div class="text-center mb-5">
          <div class="stat-pill d-inline-flex mb-3">
            <i class="bi bi-search me-2"></i> ANALYTICS HUB
          </div>
          <h1 class="quantum-title fw-bold text-gradient-primary mb-2">Search Records</h1>
          <p class="text-white opacity-50 small">Filter and retrieve historical financial data by date</p>
        </div>

        <!-- Search Controls -->
        <div class="row justify-content-center mb-5">
          <div class="col-md-6 col-lg-5">
            <div class="glass-panel p-4 p-md-5">
              <div class="row g-3 align-items-end">
                <div class="col">
                  <label class="form-label x-small">Target Date</label>
                  <input type="date" class="form-control" [(ngModel)]="searchDate">
                </div>
                <div class="col-auto">
                  <button class="btn btn-quantum-accent px-4 py-2" (click)="onSearch()" [disabled]="!searchDate || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-search me-2" *ngIf="!loading"></i> Find
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="q-table-container animate__animated animate__fadeInUp" *ngIf="records.length > 0 || searched">
          <div class="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-white-50 text-uppercase tracking-widest small">Search Results</h6>
            <div *ngIf="records.length > 0" class="stat-pill accent">
              {{ records.length }} MATCHES FOUND
            </div>
          </div>

          <div class="table-responsive">
            <table class="q-table m-0">
              <thead>
                <tr>
                  <th class="ps-4">Trip Date</th>
                  <th>Crew assignment</th>
                  <th class="text-end">Diesel Analytics</th>
                  <th class="text-end">Gross Collection</th>
                  <th class="text-end pe-4">Net Analytics</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of records" class="q-tr-hover">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="date-badge">
                        <span class="day">{{ record.date | date: 'dd' }}</span>
                        <span class="month">{{ record.date | date: 'MMM' }}</span>
                      </div>
                      <div>
                        <div class="fw-bold text-white">{{ record.date | date: 'EEEE' }}</div>
                        <div class="x-small opacity-50">{{ record.date | date: 'mediumDate' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column gap-1">
                      <div class="x-small text-white opacity-75"><i class="bi bi-person-fill text-warning me-2"></i> {{ record.driverName }}</div>
                      <div class="x-small text-white opacity-75"><i class="bi bi-person-badge text-info me-2"></i> {{ record.conductorName }}</div>
                    </div>
                  </td>
                  <td class="text-end">
                    <div class="fw-bold text-white">₹{{ record.dieselExpense | number: '1.0-0' }}</div>
                    <div class="x-small opacity-40">{{ record.dieselLiters }}L @ ₹{{ record.dieselPricePerLiter }}</div>
                  </td>
                  <td class="text-end">
                    <div class="fw-bold text-white">₹{{ record.totalCollection | number: '1.0-0' }}</div>
                    <div class="x-small opacity-40">Gross Receipts</div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="q-badge-profit" [class.success]="(record.balance || 0) >= 0" [class.danger]="(record.balance || 0) < 0">
                      ₹{{ record.balance | number: '1.0-0' }}
                    </div>
                  </td>
                </tr>

                <!-- Zero State -->
                <tr *ngIf="searched && records.length === 0 && !loading && !errorMsg">
                  <td colspan="5" class="text-center py-5">
                    <div class="animate__animated animate__pulse animate__infinite mb-3">
                      <i class="bi bi-database-exclamation fs-1 opacity-25"></i>
                    </div>
                    <h5 class="text-white opacity-50">No Records Found</h5>
                    <p class="text-white-50 x-small">No data matches for {{ searchDate | date: 'fullDate' }}.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Feedback Messages -->
        <div *ngIf="errorMsg" class="glass-card mt-4 border-danger border-opacity-20 bg-danger bg-opacity-5 p-3 text-center">
          <span class="text-danger small fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quantum-title { font-size: 2.25rem; letter-spacing: -0.5px; }
    
    .stat-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.8rem;
      border-radius: 50px;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--q-primary);
    }
    
    .stat-pill.accent {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
      color: var(--q-primary);
    }

    .date-badge {
      width: 44px; height: 44px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      line-height: 1;
    }
    .date-badge .day { font-weight: 800; font-size: 1rem; color: #fff; }
    .date-badge .month { font-size: 0.55rem; text-transform: uppercase; color: var(--q-text-muted); }

    .x-small { font-size: 0.7rem; font-weight: 600; }
    .tracking-widest { letter-spacing: 0.15em; }
  `]
})
export class SearchFinanceComponent {
  searchDate = '';
  records: DailyFinance[] = [];
  loading = false;
  searched = false;
  errorMsg = '';

  constructor(
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef
  ) { }

  onSearch(): void {
    if (this.searchDate) {
      this.loading = true;
      this.searched = true;
      this.errorMsg = '';
      this.records = [];

      const formattedDate = this.searchDate.includes('T')
        ? this.searchDate.split('T')[0]
        : this.searchDate;

      this.financeService.getFinanceByDate(formattedDate).subscribe({
        next: (data) => {
          this.records = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Search failed', err);
          this.loading = false;
          this.records = [];
          this.errorMsg = 'Search failed. Verify server connection.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}

