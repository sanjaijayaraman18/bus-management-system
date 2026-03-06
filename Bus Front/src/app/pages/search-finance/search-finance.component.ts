import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { DailyFinance } from '../../core/models/finance.model';

@Component({
  selector: 'app-search-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row mb-4 justify-content-center">
        <div class="col-md-6 text-center">
           <h3><i class="bi bi-search me-2"></i> Search Records By Date</h3>
        </div>
      </div>

      <div class="row justify-content-center mb-4">
        <div class="col-md-6">
          <div class="card p-3 shadow-sm border-0">
            <div class="row g-2 align-items-center">
              <div class="col">
                <input type="date" class="form-control" [(ngModel)]="searchDate">
              </div>
              <div class="col-auto">
                <button class="btn btn-primary px-4" (click)="onSearch()" [disabled]="!searchDate || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="bi bi-search me-1"></i> {{ loading ? 'Searching...' : 'Search' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="card border-0 shadow-sm" *ngIf="records.length > 0 || searched">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th>Date</th>
                <th>Driver</th>
                <th>Conductor</th>
                <th>Driver Sal.</th>
                <th>Cond. Sal.</th>
                <th>Cleaner</th>
                <th>Diesel (ℓ)</th>
                <th>Price/ℓ</th>
                <th>Diesel Total</th>
                <th>Collection</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <!-- Results -->
              <tr *ngFor="let record of records">
                <td>{{ record.date }}</td>
                <td>{{ record.driverName }}</td>
                <td>{{ record.conductorName }}</td>
                <td>{{ record.driverSalaryPaid | currency:'INR' }}</td>
                <td>{{ record.conductorSalaryPaid | currency:'INR' }}</td>
                <td>₹100</td>
                <td>{{ record.dieselLiters }}</td>
                <td>{{ record.dieselPricePerLiter | currency:'INR' }}</td>
                <td>{{ (record.dieselLiters * record.dieselPricePerLiter) | currency:'INR' }}</td>
                <td>{{ record.totalCollection | currency:'INR' }}</td>
                <td [ngClass]="{'text-success': (record.balance || 0) > 0, 'text-danger': (record.balance || 0) < 0}">
                  <strong>{{ record.balance | currency:'INR' }}</strong>
                </td>
              </tr>

              <!-- Loading State -->
              <tr *ngIf="loading">
                <td colspan="11" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="mt-2 text-muted mb-0">Fetching records...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr *ngIf="searched && records.length === 0 && !loading && !errorMsg">
                <td colspan="11" class="text-center py-4 text-muted animate__animated animate__fadeIn">
                  <i class="bi bi-info-circle me-2"></i> No records found for the selected date.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMsg" class="alert alert-danger mt-3 shadow-sm border-0 animate__animated animate__shakeX">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
      </div>
    </div>
  `
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
      this.records = []; // Clear previous results while loading

      // Ensure YYYY-MM-DD format
      const formattedDate = this.searchDate.includes('T')
        ? this.searchDate.split('T')[0]
        : this.searchDate;

      console.log('DEBUG: Searching for date:', formattedDate);

      this.financeService.getFinanceByDate(formattedDate).subscribe({
        next: (data) => {
          console.log('DEBUG: Received records:', data.length);
          this.records = data || [];
          this.loading = false;
          this.cdr.detectChanges(); // Force UI update
        },
        error: (err) => {
          console.error('DEBUG: Search failed', err);
          this.loading = false;
          this.records = [];
          this.errorMsg = 'Could not retrieve records. Verify connection.';
          this.cdr.detectChanges(); // Force UI update
        }
      });
    }
  }
}
