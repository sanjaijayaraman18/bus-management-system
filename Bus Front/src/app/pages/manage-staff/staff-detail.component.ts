import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';

@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold"><i class="bi bi-person-badge me-2 text-warning"></i> Staff Information</h5>
              <a routerLink="/staff-list" class="btn btn-outline-light btn-sm px-3">
                <i class="bi bi-arrow-left me-1"></i> Back
              </a>
            </div>
            
            <div *ngIf="staff" class="card-body p-4 p-md-5">
              <div class="row align-items-center mb-4">
                <div class="col-auto">
                  <div class="avatar-static" [class.bg-primary]="staff.role === 'Driver'" [class.bg-success]="staff.role === 'Conductor'">
                    {{ staff.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="col">
                  <h2 class="fw-bold mb-1">{{ staff.name }}</h2>
                  <span class="badge rounded-pill px-3 py-1 bg-light text-dark border">
                    {{ staff.role }}
                  </span>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="p-3 rounded bg-light border">
                    <label class="text-muted small fw-bold mb-1 d-block">Mobile Number</label>
                    <div class="fw-semibold">{{ staff.mobileNumber }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 rounded bg-light border">
                    <label class="text-muted small fw-bold mb-1 d-block">Age</label>
                    <div class="fw-semibold">{{ staff.age }} Years</div>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-4 rounded bg-dark text-white">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <label class="opacity-75 small fw-bold mb-1 d-block">Total Accumulated Balance</label>
                    <div class="h2 mb-0 fw-bold">₹{{ staff.totalBalance | number:'1.2-2' }}</div>
                  </div>
                  <div class="text-end">
                    <span *ngIf="staff.totalBalance <= 0" class="badge bg-success">Settled</span>
                    <span *ngIf="staff.totalBalance > 0" class="badge bg-danger">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!staff && !error" class="card-body p-5 text-center text-muted">
              <div class="spinner-border spinner-border-sm me-2"></div> Loading...
            </div>

            <div *ngIf="error" class="card-body p-5 text-center text-danger">
              <p>{{ error }}</p>
              <button (click)="loadStaff()" class="btn btn-sm btn-outline-danger">Retry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-static {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 2rem;
    }
  `]
})
export class StaffDetailComponent implements OnInit {
  staff?: StaffMember;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    const role = this.route.snapshot.paramMap.get('role');
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (role === 'driver') {
      this.staffService.getDriverById(id).subscribe({
        next: (data) => {
          this.staff = { ...data, role: 'Driver', totalBalance: 0 }; // Balance will be calculated in next step
          this.calculateBalance(data.name);
        },
        error: () => this.error = 'Failed to load driver details'
      });
    } else if (role === 'conductor') {
      this.staffService.getConductorById(id).subscribe({
        next: (data) => {
          this.staff = { ...data, role: 'Conductor', totalBalance: 0 };
          this.calculateBalance(data.name);
        },
        error: () => this.error = 'Failed to load conductor details'
      });
    }
  }

  private calculateBalance(name: string): void {
    this.staffService.staff$.subscribe(allStaff => {
      const match = allStaff.find(s => s.name === name);
      if (match && this.staff) {
        this.staff.totalBalance = match.totalBalance;
      }
    });
  }
}
