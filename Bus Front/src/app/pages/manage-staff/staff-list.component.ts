import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
              <div>
                <h3 class="mb-0 fw-bold"><i class="bi bi-people-fill me-2 text-warning"></i> Staff Management</h3>
                <small class="text-light opacity-75">View accumulated balances from daily reports</small>
              </div>
              <div class="btn-group">
                <button (click)="refresh()" class="btn btn-outline-light btn-sm px-3 me-2">
                  <i class="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
                <a routerLink="/add-driver" class="btn btn-light btn-sm px-3">
                  <i class="bi bi-plus-circle me-1"></i> Add Driver
                </a>
                <a routerLink="/add-conductor" class="btn btn-light btn-sm px-3 ms-2">
                  <i class="bi bi-plus-circle me-1"></i> Add Conductor
                </a>
              </div>
            </div>
            
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th class="ps-4">#</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Mobile Number</th>
                      <th class="text-end pe-5">Total Accumulated Balance</th>
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let staff of staffList; let i = index">
                      <td class="ps-4 fw-bold text-muted">{{ i + 1 }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar-circle me-3" [class.bg-primary]="staff.role === 'Driver'" [class.bg-success]="staff.role === 'Conductor'">
                            {{ staff.name.charAt(0).toUpperCase() }}
                          </div>
                          <span class="fw-semibold text-dark">{{ staff.name }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge rounded-pill px-3 py-1 fw-medium" 
                              [ngClass]="staff.role === 'Driver' ? 'bg-primary-soft text-primary' : 'bg-success-soft text-success'">
                          {{ staff.role }}
                        </span>
                      </td>
                      <td><i class="bi bi-phone me-1 text-muted"></i> {{ staff.mobileNumber }}</td>
                      <td class="text-end pe-5">
                        <span class="fs-5 fw-bold" [class.text-danger]="staff.totalBalance > 0" [class.text-success]="staff.totalBalance <= 0">
                          ₹{{ staff.totalBalance | number:'1.2-2' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span *ngIf="staff.totalBalance <= 0" class="badge bg-success-subtle text-success px-3 py-2">Settled</span>
                        <span *ngIf="staff.totalBalance > 0" class="badge bg-danger-subtle text-danger px-3 py-2">Pending Payment</span>
                      </td>
                      
                    </tr>
                    <tr *ngIf="staffList.length === 0">
                      <td colspan="7" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                        No staff records found. Add some to get started!
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="card-footer bg-white border-top-0 p-3 text-center">
              <span class="text-muted small">Total Records: <strong>{{ staffList.length }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }
    .bg-primary-soft { background-color: rgba(13, 110, 253, 0.1); }
    .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
    .table thead th {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      color: #6c757d;
      border-bottom: 2px solid #f8f9fa;
    }
    .table-hover tbody tr:hover {
      background-color: #fcfdfe;
    }
    .card {
      transition: transform 0.2s;
    }
  `]
})
export class StaffListComponent implements OnInit {
  staffList: StaffMember[] = [];

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    this.staffService.staff$.subscribe(staff => {
      this.staffList = staff;
    });
  }

  refresh(): void {
    this.staffService.refreshStaffList();
  }

  deleteStaff(staff: StaffMember): void {
    if (confirm(`Are you sure you want to delete ${staff.role}: ${staff.name}?`)) {
      if (staff.role === 'Driver') {
        this.staffService.deleteDriver(staff.id!).subscribe(() => {
          this.refresh();
        });
      } else {
        this.staffService.deleteConductor(staff.id!).subscribe(() => {
          this.refresh();
        });
      }
    }
  }
}
