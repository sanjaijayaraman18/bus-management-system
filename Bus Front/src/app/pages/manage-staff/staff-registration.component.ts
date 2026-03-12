import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { RouteService, Route } from '../../core/services/route.service';

@Component({
  selector: 'app-staff-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner d-flex align-items-center justify-content-center py-2 h-100 min-vh-100 overflow-auto">
      <div class="container animate__animated animate__fadeIn py-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7">
            <div class="glass-panel p-3 p-md-5">
              <app-back-button class="mb-4 d-block"></app-back-button>
              <div class="text-center mb-5">
                <div class="icon-box-quantum-sm mx-auto mb-3" [ngClass]="getRoleClass()">
                   <i [class]="getRoleIcon()"></i>
                </div>
                <h2 class="quantum-title fw-900 text-gradient-primary mb-2">
                  {{ isEditMode ? 'Modify' : 'Register' }} Staff
                </h2>
                <p class="text-label x-small uppercase tracking-widest opacity-50 mb-0">Onboard and manage transport crew members</p>
              </div>

              <form [formGroup]="staffForm" (ngSubmit)="onSubmit()" class="row g-4">
                <!-- Base Fields -->
                <div class="col-md-8">
                  <label class="form-label x-small">Full Name</label>
                  <input type="text" class="form-control" formControlName="name" placeholder="Legal name for payroll">
                </div>

                <div class="col-md-4">
                  <label class="form-label x-small">Audit Age</label>
                  <input type="number" class="form-control" formControlName="age" placeholder="Min 18">
                </div>

                <div class="col-md-6">
                  <label class="form-label x-small">Mobile Contact</label>
                  <input type="text" class="form-control" formControlName="mobileNumber" placeholder="10-digit number">
                </div>

                <div class="col-md-6">
                  <label class="form-label x-small">Assign Role</label>
                  <select class="form-select" formControlName="role" (change)="onRoleChange()">
                    <option value="" disabled>Select Role</option>
                    <option value="Driver">Driver</option>
                    <option value="Conductor">Conductor</option>
                    <option value="Cleaner">Cleaner</option>
                  </select>
                </div>

                <!-- NEW FIELDS: Salary and Route -->
                <div class="col-md-6 animate__animated animate__fadeIn">
                  <label class="form-label x-small">Fixed Salary (₹)</label>
                  <input type="number" class="form-control" formControlName="fixedSalary" placeholder="e.g. 500">
                </div>

                <div class="col-md-6 animate__animated animate__fadeIn">
                  <label class="form-label x-small">Assigned Route</label>
                  <select class="form-select" formControlName="assignedRouteId">
                    <option [value]="null">No Route Assigned</option>
                    <option *ngFor="let route of routes" [value]="route.id">{{ route.routeName }}</option>
                  </select>
                </div>

                <!-- Conditional Fields: Driver -->
                <ng-container *ngIf="staffForm.get('role')?.value === 'Driver'">
                  <div class="col-md-12 animate__animated animate__fadeIn">
                    <label class="form-label x-small">License Credentials (DL)</label>
                    <input type="text" class="form-control" formControlName="licenseNumber" placeholder="DL-XXXX-XXXX">
                  </div>
                  <div class="col-md-12 animate__animated animate__fadeIn">
                    <label class="form-label x-small">Government Aadhar ID</label>
                    <input type="text" class="form-control" formControlName="aadharNumber" placeholder="XXXX-XXXX-XXXX">
                  </div>
                </ng-container>

                <!-- Conditional Fields: Conductor -->
                <ng-container *ngIf="staffForm.get('role')?.value === 'Conductor'">
                  <div class="col-md-12 animate__animated animate__fadeIn">
                    <label class="form-label x-small">Official Employee ID</label>
                    <input type="text" class="form-control" formControlName="employeeId" placeholder="EMP-XXXX">
                  </div>
                </ng-container>

                <!-- Actions -->
                <div class="col-md-12 text-center mt-5 d-flex flex-column gap-3">
                  <button type="submit" class="btn btn-quantum-primary btn-lg w-100 py-3" [disabled]="staffForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-person-check me-2" *ngIf="!loading"></i> 
                    {{ isEditMode ? 'Authorize Update' : 'Complete Onboarding' }}
                  </button>
                  <button type="button" class="btn btn-icon-glass px-4 py-2 w-auto mx-auto border-0" (click)="onCancel()">
                    <span class="x-small tracking-widest uppercase fw-bold opacity-50">Cancel Action</span>
                  </button>
                </div>

                <!-- Feedback -->
                <div *ngIf="successMsg" class="col-12 mt-4 animate__animated animate__fadeIn">
                  <div class="glass-card border-success border-opacity-20 bg-success bg-opacity-5 p-3 text-center">
                    <span class="text-success small fw-bold"><i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}</span>
                  </div>
                </div>
                <div *ngIf="errorMsg" class="col-12 mt-4 animate__animated animate__shakeX">
                  <div class="glass-card border-danger border-opacity-20 bg-danger bg-opacity-5 p-3 text-center">
                    <span class="text-danger small fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}</span>
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
    .quantum-title { font-size: 2rem; letter-spacing: -1px; }
    
    .icon-box-quantum-sm {
       width: 80px; height: 80px;
       border-radius: 20px;
       display: flex; align-items: center; justify-content: center;
       font-size: 2.5rem;
       transition: all 0.4s ease;
       background: rgba(255, 255, 255, 0.03);
       border: 1px solid rgba(255, 255, 255, 0.1);
       color: #fff;
    }

    .icon-driver { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); color: #f59e0b; box-shadow: 0 15px 35px rgba(245, 158, 11, 0.1); }
    .icon-conductor { background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.2); color: #06b6d4; box-shadow: 0 15px 35px rgba(6, 182, 212, 0.1); }
    .icon-cleaner { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: #10b981; box-shadow: 0 15px 35px rgba(16, 185, 129, 0.1); }

    .btn-icon-glass {
       background: rgba(255, 255, 255, 0.03);
       border: 1px solid rgba(255, 255, 255, 0.1);
       color: #fff;
       border-radius: 50px;
       transition: all 0.2s ease;
    }
    .btn-icon-glass:hover {
       background: rgba(255, 255, 255, 0.07);
    }

    .x-small { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-label); opacity: 0.6; }
    .tracking-widest { letter-spacing: 0.15em; }
    .uppercase { text-transform: uppercase; }
    .fw-900 { font-weight: 900; }
  `]
})
export class StaffRegistrationComponent implements OnInit {
  staffForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  isEditMode = false;
  staffId?: number;
  initialRole?: string;
  routes: Route[] = [];

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private routeService: RouteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(80)]],
      role: ['', Validators.required],
      fixedSalary: [null, [Validators.required, Validators.min(0)]],
      assignedRouteId: [null],
      licenseNumber: [''],
      aadharNumber: [''],
      employeeId: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoutes();
    const id = this.route.snapshot.paramMap.get('id');
    const roleParam = this.route.snapshot.paramMap.get('role');

    if (id && roleParam) {
      this.isEditMode = true;
      this.staffId = Number(id);
      this.initialRole = roleParam.charAt(0).toUpperCase() + roleParam.slice(1).toLowerCase();
      this.loadStaffData(this.staffId, this.initialRole);
    }
  }

  loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe(routes => this.routes = routes);
  }

  loadStaffData(id: number, role: string): void {
    let request: Observable<any>;
    if (role === 'Driver') request = this.staffService.getDriverById(id);
    else if (role === 'Conductor') request = this.staffService.getConductorById(id);
    else request = this.staffService.getCleanerById(id);

    request.subscribe({
      next: (data: any) => {
        this.staffForm.patchValue({ 
          ...data, 
          role,
          assignedRouteId: data.assignedRoute?.id || null 
        });
        this.onRoleChange();
      },
      error: () => this.errorMsg = 'Failed to load staff data.'
    });
  }

  onRoleChange(): void {
    const role = this.staffForm.get('role')?.value;

    // Clear validations
    this.staffForm.get('licenseNumber')?.clearValidators();
    this.staffForm.get('aadharNumber')?.clearValidators();
    this.staffForm.get('employeeId')?.clearValidators();

    if (role === 'Driver') {
      this.staffForm.get('licenseNumber')?.setValidators(Validators.required);
      this.staffForm.get('aadharNumber')?.setValidators(Validators.required);
    } else if (role === 'Conductor') {
      this.staffForm.get('employeeId')?.setValidators(Validators.required);
    }

    this.staffForm.get('licenseNumber')?.updateValueAndValidity();
    this.staffForm.get('aadharNumber')?.updateValueAndValidity();
    this.staffForm.get('employeeId')?.updateValueAndValidity();
  }

  getRoleIcon(): string {
    const role = this.staffForm.get('role')?.value;
    if (role === 'Driver') return 'bi bi-person-plus-fill';
    if (role === 'Conductor') return 'bi bi-person-vcard-fill';
    if (role === 'Cleaner') return 'bi bi-stars';
    return 'bi bi-person-badge-fill';
  }

  getRoleClass(): string {
    const role = this.staffForm.get('role')?.value;
    if (role === 'Driver') return 'icon-driver';
    if (role === 'Conductor') return 'icon-conductor';
    if (role === 'Cleaner') return 'icon-cleaner';
    return '';
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.loading = true;
      this.successMsg = '';
      this.errorMsg = '';

      const role = this.staffForm.get('role')?.value;
      const formData = { ...this.staffForm.value };
      
      // Handle the route object for backend
      if (formData.assignedRouteId) {
        formData.assignedRoute = { id: formData.assignedRouteId };
      }
      delete formData.assignedRouteId;

      let operation: Observable<any>;
      if (role === 'Driver') {
        operation = this.isEditMode ? this.staffService.updateDriver(this.staffId!, formData) : this.staffService.addDriver(formData);
      } else if (role === 'Conductor') {
        operation = this.isEditMode ? this.staffService.updateConductor(this.staffId!, formData) : this.staffService.addConductor(formData);
      } else {
        operation = this.isEditMode ? this.staffService.updateCleaner(this.staffId!, formData) : this.staffService.addCleaner(formData);
      }

      operation.subscribe({
        next: () => {
          this.successMsg = `Staff member ${this.isEditMode ? 'updated' : 'registered'} successfully!`;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/staff-reports']), 1500);
        },
        error: () => {
          this.loading = false;
          this.errorMsg = `Failed to ${this.isEditMode ? 'update' : 'register'} staff member.`;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/staff-reports']);
  }
}
