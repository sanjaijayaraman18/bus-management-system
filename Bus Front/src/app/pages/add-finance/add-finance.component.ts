import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { StaffService } from '../../core/services/staff.service';
import { Driver, Conductor } from '../../core/models/staff.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-finance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-dark text-white p-3">
              <h5 class="mb-0">{{ isEditMode ? 'Modify' : 'Create' }} Daily Report</h5>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="financeForm" (ngSubmit)="onSubmit()" class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" formControlName="date">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Total Collection</label>
                  <div class="input-group">
                    <span class="input-group-text">₹</span>
                    <input type="number" class="form-control" formControlName="totalCollection">
                  </div>
                </div>

                <div class="col-md-12 mt-4"><h6 class="border-bottom pb-2 fw-bold text-muted">Personnel Payments</h6></div>
                <div class="col-md-6">
                  <label class="form-label">Driver Name</label>
                  <select class="form-select" formControlName="driverName">
                    <option value="">-- Select Driver --</option>
                    <option *ngFor="let drv of drivers" [value]="drv.name">{{ drv.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Driver Salary Paid</label>
                  <input type="number" class="form-control" formControlName="driverSalaryPaid">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Conductor Name</label>
                  <select class="form-select" formControlName="conductorName">
                    <option value="">-- Select Conductor --</option>
                    <option *ngFor="let cnd of conductors" [value]="cnd.name">{{ cnd.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Conductor Salary Paid</label>
                  <input type="number" class="form-control" formControlName="conductorSalaryPaid">
                </div>

                <div class="col-md-12 mt-4"><h6 class="border-bottom pb-2 fw-bold text-muted">Expense Breakdown</h6></div>
                <div class="col-md-4">
                  <label class="form-label">Diesel Liters</label>
                  <input type="number" class="form-control" formControlName="dieselLiters">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Diesel Price</label>
                  <input type="number" class="form-control" formControlName="dieselPricePerLiter">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Diesel Cost</label>
                  <div class="form-control bg-light text-muted fw-bold">₹{{ dieselPreview | number:'1.2-2' }}</div>
                </div>

                <div class="col-md-6">
                  <div class="form-check form-switch mt-3">
                    <input class="form-check-input" type="checkbox" formControlName="includeUnionFees" id="uFees">
                    <label class="form-check-label" for="uFees">Union Fees (₹52)</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check form-switch mt-3">
                    <input class="form-check-input" type="checkbox" formControlName="includePooSelavu" id="pSel">
                    <label class="form-check-label" for="pSel">Poo Selavu (₹20)</label>
                  </div>
                </div>

                <div class="col-md-12 mt-5">
                  <div class="p-4 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="mb-0 fw-bold">Estimated Net Balance</h4>
                      <small class="text-muted">Calculated from collection minus all expenses</small>
                    </div>
                    <div class="text-end">
                      <h2 class="mb-0 fw-bold" [class.text-danger]="netPreview < 0" [class.text-success]="netPreview >= 0">
                        ₹{{ netPreview | number:'1.2-2' }}
                      </h2>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 text-center mt-4">
                  <button type="submit" class="btn btn-primary px-5 py-2 shadow-sm me-2" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditMode ? 'Update Record' : 'Save Record' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary px-5 py-2" (click)="onCancel()">Cancel</button>
                </div>

                <div class="col-12 mt-3">
                  <div *ngIf="successMsg" class="alert alert-success shadow-sm border-0 animate__animated animate__fadeIn">
                    <i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}
                  </div>
                  <div *ngIf="errorMsg" class="alert alert-danger shadow-sm border-0 animate__animated animate__shakeX">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddFinanceComponent implements OnInit {
  financeForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  isEditMode = false;
  reportId?: number;

  drivers: Driver[] = [];
  conductors: Conductor[] = [];

  // Real-time calculation previews
  dieselPreview = 0;
  totalGrossExpense = 0;
  finalAdjustedExpense = 0;
  netPreview = 0;

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.financeForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      driverName: ['', Validators.required],
      conductorName: ['', Validators.required],
      driverSalaryPaid: [0, [Validators.required, Validators.min(0)]],
      conductorSalaryPaid: [0, [Validators.required, Validators.min(0)]],
      cleanerPadi: [100, [Validators.required]],
      dieselLiters: [0, [Validators.required, Validators.min(0)]],
      dieselPricePerLiter: [0, [Validators.required, Validators.min(0)]],
      totalCollection: [0, [Validators.required, Validators.min(0)]],
      includeUnionFees: [true],
      includePooSelavu: [true],
    });
  }

  ngOnInit(): void {
    this.loadStaff();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.reportId = Number(id);
      this.loadReportData(this.reportId);
    }

    // Watch form changes for real-time calculation
    this.financeForm.valueChanges.subscribe(() => {
      this.calculateFinances();
    });
    this.calculateFinances(); // Initial run
  }

  loadStaff(): void {
    this.staffService.getDrivers().subscribe(data => this.drivers = data);
    this.staffService.getConductors().subscribe(data => this.conductors = data);
  }

  loadReportData(id: number): void {
    this.loading = true;
    this.financeService.getFinanceById(id).subscribe({
      next: (data) => {
        this.financeForm.patchValue(data);
        this.loading = false;
        this.calculateFinances();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMsg = 'Failed to load report data.';
      }
    });
  }

  private calculateFinances(): void {
    const vals = this.financeForm.getRawValue();

    // 1. Diesel Preview
    this.dieselPreview = (vals.dieselLiters || 0) * (vals.dieselPricePerLiter || 0);

    // 2. Total Gross Expense (Sum of everything)
    const staffSalaries = (vals.driverSalaryPaid || 0) + (vals.conductorSalaryPaid || 0);
    const fees = (vals.includeUnionFees ? 52 : 0) + (vals.includePooSelavu ? 20 : 0);
    const cleaner = vals.cleanerPadi || 100;

    this.totalGrossExpense = staffSalaries + fees + cleaner + this.dieselPreview;

    // 3. Standard Logic: Final Expense is the Total Gross Expense
    this.finalAdjustedExpense = this.totalGrossExpense;

    // 4. Net Balance = Collection - Final Expense
    this.netPreview = (vals.totalCollection || 0) - this.totalGrossExpense;
  }

  onSubmit(): void {
    if (this.financeForm.valid) {
      this.loading = true;
      this.successMsg = '';
      this.errorMsg = '';

      const formData = { ...this.financeForm.getRawValue() };

      const operation = this.isEditMode
        ? this.financeService.updateFinance(this.reportId!, formData)
        : this.financeService.saveFinance(formData);

      operation.subscribe({
        next: () => {
          this.successMsg = `Record ${this.isEditMode ? 'updated' : 'saved'} successfully!`;
          this.loading = false;
          this.staffService.refreshStaffList();
          setTimeout(() => this.router.navigate(['/view']), 1200);
        },
        error: (err) => {
          this.loading = false;
          console.error('Operation failed:', err);
          this.errorMsg = `Failed to ${this.isEditMode ? 'update' : 'save'} record. Please try again.`;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/view']);
  }
}
