import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { StaffService } from '../../core/services/staff.service';
import { RouteService, Route } from '../../core/services/route.service';
import { Driver, Conductor, Cleaner } from '../../core/models/staff.model';
import { Router, ActivatedRoute } from '@angular/router';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-add-finance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner h-100 vh-100 overflow-hidden">
      <div class="container py-2 animate__animated animate__fadeIn">
        <div class="row justify-content-center">
          <div class="col-xl-11">
            
            <!-- Header Section (Centering Grid) -->
            <div class="quantum-header-grid mb-3">
              <!-- Left: Back Button -->
              <div class="header-left">
                <app-back-button class="mb-0"></app-back-button>
              </div>

              <!-- Center: Title & Icon -->
              <div class="header-center d-flex align-items-center gap-3">
                <div class="brand-icon-premium-xs">
                   <i class="bi bi-bus-front-fill"></i>
                </div>
                <h1 class="quantum-title-xs fw-bold text-gradient-primary mb-0">
                  {{ isEditMode ? 'Modify' : 'New' }} Daily Report
                </h1>
              </div>

              <!-- Right: Actions -->
              <div class="header-right d-flex gap-2">
                <button type="submit" form="financeForm" class="btn btn-quantum-primary-sm" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                   Save Report
                </button>
                <button type="button" class="btn btn-glass-sm" (click)="onCancel()">Discard</button>
              </div>
            </div>

            <div class="glass-panel p-3 px-md-4">
              <form id="financeForm" [formGroup]="financeForm" (ngSubmit)="onSubmit()">
                
                <!-- Performance Context Strip -->
                <div class="performance-context-strip mb-4 p-3 d-flex flex-wrap align-items-center justify-content-between gap-4">
                  <div class="d-flex align-items-center gap-4 flex-grow-1">
                    <div class="context-item">
                      <label class="q-label-xs opacity-50 mb-1">Trip Date</label>
                      <input type="date" class="form-control q-input-dense" formControlName="date">
                    </div>
                    <div class="context-item flex-grow-1">
                      <label class="q-label-xs opacity-50 mb-1">Selected Route</label>
                      <select class="form-select q-input-dense" formControlName="routeId" (change)="onRouteSelect($event)">
                        <option value="">-- Choose Route --</option>
                        <option *ngFor="let route of routesList" [value]="route.id">{{ route.routeName }}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="context-item text-end pe-2">
                    <label class="q-label-xs opacity-50 mb-1">Gross Collection</label>
                    <div class="input-group">
                      <span class="input-group-text q-symbol-dense">₹</span>
                      <input type="number" class="form-control q-input-dense fw-bold text-accent fs-5" formControlName="totalCollection" placeholder="0">
                    </div>
                  </div>
                </div>

                <!-- Main Operational Grid (4 Columns) -->
                <div class="finance-ops-grid mb-4">
                  <!-- Driver Card -->
                  <div class="finance-card card-warning animate__animated animate__fadeInUp">
                    <div class="card-title-area">
                      <i class="bi bi-person-fill"></i>
                      <span>DRIVER</span>
                    </div>
                    <div class="card-body-area">
                      <div class="input-group mb-2">
                        <select class="form-select q-input-card" formControlName="driverName">
                          <option value="">-- Select Driver --</option>
                          <option *ngFor="let drv of drivers" [value]="drv.name">{{ drv.name }}</option>
                        </select>
                      </div>
                      <div class="input-group">
                        <span class="input-group-text q-symbol-card">₹</span>
                        <input type="number" class="form-control q-input-card fw-bold" formControlName="driverSalaryPaid" placeholder="Salary Paid">
                      </div>
                      <div class="fixed-sal-indicator mt-2">
                        <span class="opacity-50">FIXED:</span> <b>₹{{ fixedDriverSal }}</b>
                      </div>
                    </div>
                  </div>

                  <!-- Conductor Card -->
                  <div class="finance-card card-info animate__animated animate__fadeInUp animate__delay-1s">
                    <div class="card-title-area">
                      <i class="bi bi-person-badge-fill"></i>
                      <span>CONDUCTOR</span>
                    </div>
                    <div class="card-body-area">
                      <div class="input-group mb-2">
                        <select class="form-select q-input-card" formControlName="conductorName">
                          <option value="">-- Select Conductor --</option>
                          <option *ngFor="let cnd of conductors" [value]="cnd.name">{{ cnd.name }}</option>
                        </select>
                      </div>
                      <div class="input-group">
                        <span class="input-group-text q-symbol-card">₹</span>
                        <input type="number" class="form-control q-input-card fw-bold" formControlName="conductorSalaryPaid" placeholder="Salary Paid">
                      </div>
                      <div class="fixed-sal-indicator mt-2">
                        <span class="opacity-50">FIXED:</span> <b>₹{{ fixedCondSal }}</b>
                      </div>
                    </div>
                  </div>

                  <!-- Cleaner Card -->
                  <div class="finance-card card-success animate__animated animate__fadeInUp animate__delay-1s">
                    <div class="card-title-area">
                      <i class="bi bi-stars"></i>
                      <span>CLEANER</span>
                    </div>
                    <div class="card-body-area">
                      <div class="input-group mb-2">
                        <select class="form-select q-input-card" formControlName="cleanerName">
                          <option value="">-- Select Cleaner --</option>
                          <option *ngFor="let cl of cleaners" [value]="cl.name">{{ cl.name }}</option>
                        </select>
                      </div>
                      <div class="input-group">
                        <span class="input-group-text q-symbol-card">₹</span>
                        <input type="number" class="form-control q-input-card fw-bold" formControlName="cleanerPadi" placeholder="Padi / Salary">
                      </div>
                      <div class="fixed-sal-indicator mt-2">
                        <span class="opacity-50">FIXED:</span> <b>₹{{ fixedCleanerSal }}</b>
                      </div>
                    </div>
                  </div>

                  <!-- Diesel Card -->
                  <div class="finance-card card-accent animate__animated animate__fadeInUp animate__delay-2s">
                    <div class="card-title-area">
                      <i class="bi bi-fuel-pump-fill"></i>
                      <span>DIESEL COST</span>
                    </div>
                    <div class="card-body-area">
                      <div class="row g-2 mb-2">
                        <div class="col-6">
                           <input type="number" class="form-control q-input-card x-small-ph" formControlName="dieselLiters" placeholder="Liters">
                        </div>
                        <div class="col-6">
                           <input type="number" class="form-control q-input-card x-small-ph" formControlName="dieselPricePerLiter" placeholder="Price">
                        </div>
                      </div>
                      <div class="total-cost-box d-flex justify-content-between align-items-center px-2">
                        <span class="x-small-text opacity-50">TOTAL</span>
                        <span class="fw-bold fs-5">₹{{ (financeForm.get('dieselExpense')?.value || 0) | number:'1.0-0' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Expenses Strip -->
                <div class="expenses-strip mb-4 p-3 d-flex flex-wrap justify-content-center align-items-center gap-5">
                   <div class="d-flex align-items-center gap-3">
                      <label class="q-label-xs mb-0">UNION FEE</label>
                      <div class="input-group" style="width: 140px;">
                        <span class="input-group-text q-symbol-mini">₹</span>
                        <input type="number" class="form-control q-input-mini" formControlName="unionFee">
                      </div>
                   </div>
                   <div class="d-flex align-items-center gap-3">
                      <label class="q-label-xs mb-0">OTHER (POO SELAVU)</label>
                      <div class="input-group" style="width: 140px;">
                        <span class="input-group-text q-symbol-mini">₹</span>
                        <input type="number" class="form-control q-input-mini" formControlName="pooSelavu">
                      </div>
                   </div>
                </div>

                <!-- Analysis Strip (Final Result) -->
                <div class="profit-strip p-3 px-4 d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center gap-3">
                    <div class="strip-label fw-bold">Daily Net Profit</div>
                    <div class="x-small-text opacity-40 d-none d-md-block">Summary calculation based on collection and listed expenses</div>
                  </div>
                  <div class="profit-value-dense" [class.text-danger]="netPreview < 0" [class.text-success]="netPreview >= 0">
                    ₹{{ netPreview | number:'1.2-2' }}
                  </div>
                </div>

                <div class="col-12 mt-3">
                  <div *ngIf="successMsg" class="alert-compact success p-2 px-3 animate__animated animate__shakeY">
                    <i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}
                  </div>
                  <div *ngIf="errorMsg" class="alert-compact danger p-2 px-3 animate__animated animate__shakeX">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-inner { position: relative; }
    
    .brand-icon-premium-xs {
      width: 2.2rem; height: 2.2rem;
      background: var(--q-primary);
      color: #fff;
      border-radius: 8px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 0 10px var(--q-primary-glow);
    }

    .quantum-title-xs { font-family: 'Outfit', sans-serif; font-size: 1.2rem; letter-spacing: -0.5px; }

    /* Centering Header Grid */
    .quantum-header-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      width: 100%;
    }
    .header-left { justify-self: start; }
    .header-center { justify-self: center; }
    .header-right { justify-self: end; }

    /* Responsive Header Adjustments */
    @media (max-width: 768px) {
      .quantum-header-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
      }
      .header-left, .header-center, .header-right { 
        justify-self: center; 
      }
    }

    /* Performance Context Strip */
    .performance-context-strip {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
    }
    .context-item label { color: var(--q-primary); font-weight: 700; }

    /* Finance Operations Grid */
    .finance-ops-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 1200px) {
      .finance-ops-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .finance-ops-grid { grid-template-columns: 1fr; }
    }

    /* Universal Finance Card */
    .finance-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 18px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }
    .finance-card:hover {
      transform: translateY(-5px);
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .card-title-area {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: 'Outfit', sans-serif;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .card-body-area { padding: 1.25rem; }

    /* Role Based Accents */
    .card-warning { border-top: 4px solid #ffc107; }
    .card-warning .card-title-area i { color: #ffc107; }
    .card-info { border-top: 4px solid #0dcaf0; }
    .card-info .card-title-area i { color: #0dcaf0; }
    .card-success { border-top: 4px solid #198754; }
    .card-success .card-title-area i { color: #198754; }
    .card-accent { border-top: 4px solid var(--q-accent); }
    .card-accent .card-title-area i { color: var(--q-accent); }

    /* Input Refinements */
    .q-input-card {
      background: rgba(0,0,0,0.2) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      color: #fff !important;
      font-size: 0.85rem !important;
      border-radius: 10px !important;
      padding: 0.5rem 0.75rem !important;
    }
    .q-symbol-card {
      background: rgba(255,255,255,0.03) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-right: none !important;
      color: var(--q-primary) !important;
      font-size: 0.8rem !important;
      border-radius: 10px 0 0 10px !important;
      width: 32px; justify-content: center;
    }
    .q-symbol-card + .q-input-card { border-radius: 0 10px 10px 0 !important; }

    .fixed-sal-indicator { font-size: 0.6rem; letter-spacing: 0.5px; color: rgba(255,255,255,0.4); }
    .fixed-sal-indicator b { color: var(--q-primary); }

    .total-cost-box {
      height: 48px;
      background: rgba(var(--q-accent-rgb), 0.05);
      border: 1px dashed rgba(var(--q-accent-rgb), 0.2);
      border-radius: 12px;
      color: var(--q-accent);
    }
    .x-small-ph::placeholder { font-size: 0.7rem; opacity: 0.5; }

    /* Expenses Strip */
    .expenses-strip {
      background: rgba(15, 23, 42, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 16px;
    }
    .q-input-mini {
      background: rgba(0,0,0,0.2) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      color: #fff !important;
      font-size: 0.8rem !important;
      border-radius: 0 8px 8px 0 !important;
      padding: 0.3rem 0.6rem !important;
    }
    .q-symbol-mini {
      background: rgba(255,255,255,0.03) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-right: none !important;
      color: var(--q-accent) !important;
      font-size: 0.7rem !important;
      border-radius: 8px 0 0 8px !important;
      width: 28px; justify-content: center;
    }

    /* Profit Strip */
    .profit-strip {
      background: var(--q-glass);
      backdrop-filter: blur(15px);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
    }
    .strip-label { font-family: 'Outfit', sans-serif; font-size: 1.1rem; color: var(--q-primary); letter-spacing: 0.5px; }
    .profit-value-dense { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.8rem; text-shadow: 0 0 20px rgba(0,0,0,0.5); }

    /* Utility */
    .q-label-xs { font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
    .x-small-text { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .btn-quantum-primary-sm { background: var(--q-primary); color: white; border: none; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.8rem; padding: 0.6rem 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px var(--q-primary-glow); transition: all 0.3s ease; }
    .btn-quantum-primary-sm:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--q-primary-glow); }
    .btn-glass-sm { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: 0.8rem; }
    
    .alert-compact { border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
    .alert-compact.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: var(--q-success); }
    .alert-compact.danger { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--q-danger); }
  `]
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
  cleaners: Cleaner[] = [];
  routesList: Route[] = [];

  fixedDriverSal = 0;
  fixedCondSal = 0;
  fixedCleanerSal = 0;
  netPreview = 0;

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    private staffService: StaffService,
    private routeService: RouteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.financeForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      routeId: ['', Validators.required],
      driverName: ['', Validators.required],
      conductorName: ['', Validators.required],
      cleanerName: ['', Validators.required],
      driverSalaryPaid: [0, [Validators.required, Validators.min(0)]],
      conductorSalaryPaid: [0, [Validators.required, Validators.min(0)]],
      cleanerPadi: [0, [Validators.required, Validators.min(0)]],
      unionFee: [0, [Validators.required, Validators.min(0)]],
      pooSelavu: [0, [Validators.required, Validators.min(0)]],
      dieselLiters: [0, [Validators.required, Validators.min(0)]],
      dieselPricePerLiter: [0, [Validators.required, Validators.min(0)]],
      dieselExpense: [0, [Validators.required, Validators.min(0)]],
      totalCollection: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadStaff();
    this.loadRoutes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.reportId = Number(id);
      this.loadReportData(this.reportId);
    }

    this.financeForm.valueChanges.subscribe(() => {
      // Small timeout to allow input value to stabilize
      setTimeout(() => this.calculatePreview(), 0);
    });
  }

  loadStaff(): void {
    this.staffService.getDrivers().subscribe(data => this.drivers = data);
    this.staffService.getConductors().subscribe(data => this.conductors = data);
    this.staffService.getCleaners().subscribe(data => this.cleaners = data);
  }

  loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe(data => this.routesList = data);
  }

  onRouteSelect(event: any): void {
    const routeId = event.target.value;
    if (routeId) {
      const selectedRoute = this.routesList.find(r => r.id == routeId);
      if (selectedRoute) {
        this.fixedDriverSal = selectedRoute.driverSalary || 0;
        this.fixedCondSal = selectedRoute.conductorSalary || 0;
        this.fixedCleanerSal = selectedRoute.cleanerSalary || 0;
        this.financeForm.patchValue({
          cleanerPadi: selectedRoute.cleanerSalary || 0
        });
      }
    } else {
      this.fixedDriverSal = 0;
      this.fixedCondSal = 0;
      this.fixedCleanerSal = 0;
      this.financeForm.patchValue({ cleanerPadi: 0 });
    }
    this.calculatePreview();
  }

  loadReportData(id: number): void {
    this.loading = true;
    this.financeService.getFinanceById(id).subscribe({
      next: (data: any) => {
        const formData = { ...data };
        if (data.route) {
          formData.routeId = data.route.id;
          this.fixedDriverSal = data.route.driverSalary || 0;
          this.fixedCondSal = data.route.conductorSalary || 0;
          this.fixedCleanerSal = data.route.cleanerSalary || 0;
        }
        this.financeForm.patchValue(formData);
        this.calculatePreview();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load report.';
        this.loading = false;
      }
    });
  }

  private calculatePreview(): void {
    const vals = this.financeForm.getRawValue();

    // 1. Automatic Diesel Expense Calculation
    const liters = vals.dieselLiters || 0;
    const price = vals.dieselPricePerLiter || 0;
    const calculatedDiesel = liters * price;

    // Update the form field
    this.financeForm.patchValue({ dieselExpense: calculatedDiesel }, { emitEvent: false });

    // 2. Net Profit Calculation (Using ACTUAL PAID salaries as requested)
    const otherExpenses = calculatedDiesel + (vals.unionFee || 0) + (vals.pooSelavu || 0) + (vals.cleanerPadi || 0);
    const totalTripExpenses = (vals.driverSalaryPaid || 0) + (vals.conductorSalaryPaid || 0) + otherExpenses;
    this.netPreview = (vals.totalCollection || 0) - totalTripExpenses;

    // Explicitly notify Angular to fix ExpressionChangedAfterItHasBeenCheckedError
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.financeForm.valid) {
      this.loading = true;
      const rawData = this.financeForm.getRawValue();
      const formData = {
        ...rawData,
        route: { id: rawData.routeId }
      };
      delete formData.routeId;

      const operation = this.isEditMode
        ? this.financeService.updateFinance(this.reportId!, formData)
        : this.financeService.saveFinance(formData);

      operation.subscribe({
        next: () => {
          this.successMsg = `Record ${this.isEditMode ? 'updated' : 'saved'}!`;
          this.staffService.refreshStaffList();
          setTimeout(() => this.router.navigate(['/view']), 1200);
        },
        error: () => {
          this.errorMsg = 'Submission failed.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/view']);
  }
}

