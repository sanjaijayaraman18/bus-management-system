import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-conductor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-6">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-header bg-dark text-white p-3">
              <h5 class="mb-0">{{ isEditMode ? 'Modify' : 'Register' }} Conductor Details</h5>
            </div>
            <div class="card-body p-4 p-md-5">
              <form [formGroup]="conductorForm" (ngSubmit)="onSubmit()">
                
                <div class="mb-4">
                  <label class="form-label fw-bold">Full Name</label>
                  <input type="text" class="form-control" formControlName="name" placeholder="Enter conductor name">
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-md-7">
                    <label class="form-label fw-bold">Mobile Number</label>
                    <input type="text" class="form-control" formControlName="mobileNumber" placeholder="10-digit number">
                  </div>
                  <div class="col-md-5">
                    <label class="form-label fw-bold">Age</label>
                    <input type="number" class="form-control" formControlName="age" placeholder="Min 18">
                  </div>
                </div>
                
                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-primary px-4 py-2 flex-grow-1 shadow-sm" [disabled]="conductorForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isEditMode ? 'Update Details' : 'Save Details' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary px-4 py-2" (click)="onCancel()">Cancel</button>
                </div>
                
                <div *ngIf="successMsg" class="alert alert-success mt-4 border-0 shadow-sm">
                  <i class="bi bi-check-circle-fill me-2"></i> {{ successMsg }}
                </div>
                <div *ngIf="errorMsg" class="alert alert-danger mt-4 border-0 shadow-sm">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMsg }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

    .page-container {
      background-color: #f0f2f5;
      min-height: 100vh;
      font-family: 'Outfit', sans-serif;
    }

    .ls-1 { letter-spacing: 0.5px; }
    
    .form-card {
      border-radius: 30px;
      overflow: hidden;
    }

    .input-group-modern {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.3s ease;
      background: white;
    }
    .input-group-modern:focus-within {
      border-color: #0dcaf0;
      box-shadow: 0 0 0 4px rgba(13, 202, 240, 0.1);
    }
    .input-group-modern .form-control, .input-group-modern .input-group-text {
      border: none;
      padding: 12px 15px;
    }

    .form-control:focus {
      box-shadow: none;
    }

    .shadow-info {
      box-shadow: 0 10px 15px -3px rgba(13, 202, 240, 0.2);
    }

    .flex-grow-2 { flex-grow: 2; }
    .animate__animated { --animate-duration: 0.5s; }
  `]
})
export class AddConductorComponent implements OnInit {
  conductorForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  isEditMode = false;
  conductorId?: number;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.conductorForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(80)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.conductorId = Number(id);
      this.loadConductorData(this.conductorId);
    }
  }

  loadConductorData(id: number): void {
    this.staffService.getConductorById(id).subscribe({
      next: (data) => {
        this.conductorForm.patchValue(data);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load conductor data.';
      }
    });
  }

  onSubmit(): void {
    if (this.conductorForm.valid) {
      this.loading = true;
      this.successMsg = '';
      this.errorMsg = '';

      const operation = this.isEditMode
        ? this.staffService.updateConductor(this.conductorId!, this.conductorForm.value)
        : this.staffService.addConductor(this.conductorForm.value);

      operation.subscribe({
        next: () => {
          this.successMsg = `Conductor ${this.isEditMode ? 'updated' : 'added'} successfully!`;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/staff-list']), 1200);
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = `Failed to ${this.isEditMode ? 'update' : 'add'} conductor. Please try again.`;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/staff-list']);
  }
}
