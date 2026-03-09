import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RouteService } from '../../core/services/route.service';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner d-flex align-items-center justify-content-center p-0 vh-100 overflow-hidden">
      <div class="container animate__animated animate__fadeIn py-3">
        <div class="row justify-content-center">
          <div class="col-md-9 col-lg-7">
            <div class="glass-panel p-3 p-md-4 border-0">
              <app-back-button></app-back-button>
              <div class="text-center mb-3">
                <div class="icon-box-quantum mx-auto mb-2">
                   <i class="bi bi-map-fill"></i>
                </div>
                <h2 class="quantum-title fw-bold text-gradient-primary mb-0">Create New Route</h2>
                <p class="text-white opacity-50 x-small mb-0">Establish fleet mission parameters</p>
              </div>

              <form [formGroup]="routeForm" (ngSubmit)="onSubmit()" class="row g-3">
                <div class="col-12">
                  <label class="form-label x-small mb-1">Official Route Designation</label>
                  <input type="text" class="form-control py-2" formControlName="routeName" placeholder="e.g. TRICHY EXPRESS">
                </div>

                <div class="col-md-6">
                  <label class="form-label x-small mb-1">Starting Hub</label>
                  <input type="text" class="form-control py-2" formControlName="startLocation" placeholder="Origin">
                </div>
                <div class="col-md-6">
                  <label class="form-label x-small mb-1">Terminal Hub</label>
                  <input type="text" class="form-control py-2" formControlName="endLocation" placeholder="Destination">
                </div>

                 <div class="col-md-3 col-6">
                  <label class="form-label x-small mb-1">KM</label>
                  <input type="number" class="form-control py-2" formControlName="distance" placeholder="0">
                </div>
                <div class="col-md-3 col-6">
                    <label class="form-label x-small mb-1">DRV-FX</label>
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-0 opacity-40 px-2 small">₹</span>
                        <input type="number" class="form-control ps-0 py-2" formControlName="driverSalary">
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <label class="form-label x-small mb-1">CND-FX</label>
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-0 opacity-40 px-2 small">₹</span>
                        <input type="number" class="form-control ps-0 py-2" formControlName="conductorSalary">
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <label class="form-label x-small mb-1">CLN-FX</label>
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-0 opacity-40 px-2 small">₹</span>
                        <input type="number" class="form-control ps-0 py-2" formControlName="cleanerSalary">
                    </div>
                </div>

                 <div class="col-md-12 text-center mt-3 d-flex flex-column gap-2">
                  <button type="submit" class="btn btn-quantum-primary w-100 py-3 mt-1" [disabled]="routeForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-pin-map-fill me-2" *ngIf="!loading"></i> Deploy New Route
                  </button>
                  <button type="button" class="btn btn-icon-glass py-1 w-auto mx-auto border-0" (click)="onCancel()">
                    <span class="x-small tracking-widest text-uppercase fw-bold opacity-50">Discard Changes</span>
                  </button>
                </div>

                <div class="col-12 mt-3" *ngIf="errorMessage">
                   <div class="glass-card border-danger border-opacity-20 bg-danger bg-opacity-5 p-2 text-center">
                      <span class="text-danger x-small fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}</span>
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
    .quantum-title { font-size: 1.75rem; letter-spacing: -1px; }
    
     .icon-box-quantum {
        width: 48px; height: 48px;
        background: rgba(124, 58, 237, 0.1);
        border: 1px solid rgba(124, 58, 237, 0.2);
        color: #8b5cf6;
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
        box-shadow: 0 8px 20px rgba(124, 58, 237, 0.1);
     }

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

    .x-small { font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-muted); }
    .tracking-widest { letter-spacing: 0.15em; }
  `]
})
export class AddRouteComponent {
  routeForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private router: Router
  ) {
    this.routeForm = this.fb.group({
      routeName: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: ['', [Validators.required, Validators.min(0)]],
      driverSalary: ['', [Validators.required, Validators.min(0)]],
      conductorSalary: ['', [Validators.required, Validators.min(0)]],
      cleanerSalary: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      this.loading = true;
      this.routeService.createRoute(this.routeForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to create route';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

