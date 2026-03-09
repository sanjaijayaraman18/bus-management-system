import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BusService } from '../../core/services/bus.service';
import { RouteService, Route } from '../../core/services/route.service';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-add-bus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="page-wrapper dashboard-inner d-flex align-items-center justify-content-center py-2 h-100 vh-100 overflow-hidden">
      <div class="container animate__animated animate__fadeIn">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="glass-panel p-3 p-md-4">
              <app-back-button class="mb-0"></app-back-button>
              <div class="text-center mb-4">
                <div class="icon-box-quantum-sm mx-auto mb-3">
                   <i class="bi bi-bus-front-fill"></i>
                </div>
                <h2 class="quantum-title-small fw-bold text-gradient-primary mb-1">Register Bus</h2>
                <p class="text-white opacity-50 x-small mb-0">Add a new vehicle to your fleet logs</p>
              </div>

              <form [formGroup]="busForm" (ngSubmit)="onSubmit()" class="row g-4 mt-2">
                <div class="col-12">
                  <label class="form-label x-small">Bus Plate Number</label>
                  <input type="text" class="form-control" formControlName="busNumber" placeholder="e.g. TN 01 AB 1234">
                </div>

                <div class="col-12">
                  <label class="form-label x-small">Vehicle Label / Name</label>
                  <input type="text" class="form-control" formControlName="busName" placeholder="e.g. SMT Travels - A1">
                </div>

                <div class="col-12">
                  <label class="form-label x-small">Assigned Operational Route</label>
                  <select class="form-select" formControlName="routeId">
                    <option value="" disabled selected>Select active route...</option>
                    <option *ngFor="let route of routes" [value]="route.id">
                      {{ route.routeName }}
                    </option>
                  </select>
                </div>

                <div class="col-md-12 text-center mt-4 d-flex flex-column gap-2">
                  <button type="submit" class="btn btn-quantum-primary btn-lg w-100 py-3" [disabled]="busForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-plus-circle me-2" *ngIf="!loading"></i> Complete Registration
                  </button>
                  <button type="button" class="btn btn-icon-glass px-3 py-1 w-auto mx-auto border-0" (click)="onCancel()">
                    <span class="x-small tracking-widest text-uppercase fw-bold opacity-50">Cancel Action</span>
                  </button>
                </div>

                <div class="col-12 mt-4" *ngIf="errorMessage">
                   <div class="glass-card border-danger border-opacity-20 bg-danger bg-opacity-5 p-3 text-center">
                      <span class="text-danger small fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}</span>
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
    .quantum-title-small { font-size: 1.6rem; letter-spacing: -0.5px; }
    
    .icon-box-quantum-sm {
       width: 64px; height: 64px;
       background: rgba(255, 122, 0, 0.1);
       border: 1px solid rgba(255, 122, 0, 0.2);
       color: var(--q-accent);
       border-radius: 18px;
       display: flex; align-items: center; justify-content: center;
       font-size: 1.8rem;
       box-shadow: 0 10px 25px rgba(255, 122, 0, 0.1);
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

    .x-small { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--q-text-muted); }
    .tracking-widest { letter-spacing: 0.15em; }
  `]
})
export class AddBusComponent implements OnInit {
  busForm: FormGroup;
  routes: Route[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private routeService: RouteService,
    private router: Router
  ) {
    this.busForm = this.fb.group({
      busNumber: ['', Validators.required],
      busName: ['', Validators.required],
      routeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.routeService.getRouteNames().subscribe({
      next: (data) => this.routes = data,
      error: () => this.errorMessage = 'Failed to load routes. Please create a route first.'
    });
  }

  onSubmit(): void {
    if (this.busForm.valid) {
      this.loading = true;
      const busData = {
        busNumber: this.busForm.value.busNumber,
        busName: this.busForm.value.busName,
        route: { id: this.busForm.value.routeId }
      };

      this.busService.createBus(busData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to add bus';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

