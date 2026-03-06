import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FinanceService } from '../../core/services/finance.service';
import { DailyFinance } from '../../core/models/finance.model';

@Component({
  selector: 'app-finance-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-9">
          
          <div class="d-flex justify-content-between align-items-center mb-4">
            <button class="btn btn-outline-dark btn-sm px-3" routerLink="/view">
              <i class="bi bi-arrow-left me-1"></i> Back to List
            </button>
            <div *ngIf="record" class="d-flex gap-2">
               <a [routerLink]="['/edit-report', record.id]" class="btn btn-dark btn-sm px-3">
                 <i class="bi bi-pencil me-1"></i> Edit Record
               </a>
            </div>
          </div>

          <!-- Main Card -->
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden" *ngIf="record && !loading">
            <div class="card-header bg-dark text-white p-4">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="mb-0 fw-bold text-uppercase ls-1">Financial Report Details</h4>
                  <p class="mb-0 opacity-75 small"><i class="bi bi-calendar3 me-2"></i> Date: {{ record.date | date:'fullDate' }}</p>
                </div>
                <div class="col-auto text-end">
                  <div class="h3 mb-0 fw-bold">₹{{ record.balance | number:'1.2-2' }}</div>
                  <span class="badge rounded-pill px-3 py-1 mt-1" 
                        [class.bg-success]="(record.balance ?? 0) >= 0" 
                        [class.bg-danger]="(record.balance ?? 0) < 0">
                    {{ (record.balance ?? 0) >= 0 ? 'Surplus' : 'Deficit' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-body p-4 p-md-5">
              <!-- Summary Grid -->
              <div class="row g-4 mb-5">
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded border h-100">
                    <h6 class="text-muted small fw-bold text-uppercase mb-3"><i class="bi bi-people me-2"></i>Staff Assignments</h6>
                    <div class="d-flex justify-content-between mb-2">
                       <span class="text-muted">Driver:</span>
                       <span class="fw-bold">{{ record.driverName }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                       <span class="text-muted">Conductor:</span>
                       <span class="fw-bold">{{ record.conductorName }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded border h-100">
                    <h6 class="text-muted small fw-bold text-uppercase mb-3"><i class="bi bi-currency-rupee me-2"></i>Operational Totals</h6>
                    <div class="d-flex justify-content-between mb-2">
                       <span class="text-muted">Bus Collection:</span>
                       <span class="fw-bold text-success">₹{{ record.totalCollection | number:'1.2-2' }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                       <span class="text-muted">Diesel Consumption:</span>
                       <span class="fw-bold text-danger">₹{{ (record.dieselLiters * record.dieselPricePerLiter) | number:'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Expense Table -->
              <h6 class="text-muted small fw-bold text-uppercase mb-3">Itemized Expense Breakdown</h6>
              <div class="table-responsive">
                <table class="table table-bordered border-light-subtle">
                  <thead class="bg-light-subtle">
                    <tr class="small text-muted text-uppercase">
                      <th>Expense Head</th>
                      <th class="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Driver Salary Paid</td>
                      <td class="text-end fw-bold text-dark">₹{{ record.driverSalaryPaid | number:'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Conductor Salary Paid</td>
                      <td class="text-end fw-bold text-dark">₹{{ record.conductorSalaryPaid | number:'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Diesel ({{ record.dieselLiters }}ℓ @ ₹{{ record.dieselPricePerLiter }}/ℓ)</td>
                      <td class="text-end fw-bold text-dark">₹{{ (record.dieselLiters * record.dieselPricePerLiter) | number:'1.2-2' }}</td>
                    </tr>
                    <tr>
                      <td>Cleaner Padi (Fixed)</td>
                      <td class="text-end fw-bold text-dark">₹{{ record.cleanerPadi | number:'1.2-2' }}</td>
                    </tr>
                    <tr *ngIf="record.includeUnionFees">
                      <td>Union Fees Allocation</td>
                      <td class="text-end fw-bold text-dark">₹52.00</td>
                    </tr>
                    <tr *ngIf="record.includePooSelavu">
                      <td>Poo Selavu Allocation</td>
                      <td class="text-end fw-bold text-dark">₹20.00</td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-light">
                    <tr class="fw-bold">
                      <td class="text-dark">Total Operational Expenditure</td>
                      <td class="text-end text-danger">₹{{ (record.totalCollection - (record.balance ?? 0)) | number:'1.2-2' }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="text-center py-5 my-5" *ngIf="loading">
            <div class="spinner-border text-dark mb-3" role="status"></div>
            <p class="text-muted">Fetching report details from server...</p>
          </div>

          <!-- Error State -->
          <div class="card border-danger border-opacity-25 bg-danger bg-opacity-10" *ngIf="error && !loading">
            <div class="card-body p-4 text-center">
               <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
               <h5 class="fw-bold">Connection Issue</h5>
               <p class="text-muted">We couldn't retrieve the report details. It might have been deleted or the server is down.</p>
               <button class="btn btn-danger btn-sm px-4 mt-2" (click)="loadRecord(currentId)">
                 <i class="bi bi-arrow-clockwise me-1"></i> Try Again
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 0.5px; }
    .card { transition: all 0.3s ease; }
    .bg-light-subtle { background-color: #f8f9fa !important; }
  `]
})
export class FinanceDetailComponent implements OnInit {
  record?: DailyFinance;
  loading = true;
  error = false;
  currentId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private financeService: FinanceService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = Number(id);
        this.loadRecord(this.currentId);
      } else {
        this.router.navigate(['/view']);
      }
    });
  }

  loadRecord(id: number): void {
    this.loading = true;
    this.error = false;
    this.record = undefined;
    this.cdr.detectChanges();

    this.financeService.getFinanceById(id).subscribe({
      next: (data) => {
        if (data) {
          this.record = data;
        } else {
          this.error = true;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching report:', err);
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    });

    // Safety timeout: If request hangs longer than 10s, show error
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    }, 10000);
  }
}
