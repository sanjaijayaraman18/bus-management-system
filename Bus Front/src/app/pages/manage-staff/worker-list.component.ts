import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { StaffMember } from '../../core/models/staff.model';
import { Observable, Subject, BehaviorSubject, combineLatest, map, switchMap, debounceTime, distinctUntilChanged, takeUntil, tap, startWith } from 'rxjs';

@Component({
  selector: 'app-worker-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-wrapper animate__animated animate__fadeIn">
      <div class="container py-4">
        
        <!-- Header Section -->
        <div class="glass-panel p-4 mb-4 border-0 shadow-lg">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="stat-pill d-inline-flex mb-3">
                <i class="bi bi-people-fill me-2"></i> PERSONNEL MANAGEMENT
              </div>
              <h1 class="quantum-title fw-bold text-gradient-primary mb-1">Worker Directory</h1>
              <p class="text-white opacity-50 small mb-0">Unified view of all drivers, conductors, and cleaners</p>
            </div>
            <div class="stat-badge p-3 px-4 text-center">
               <div class="x-small text-uppercase opacity-50 fw-bold">Active Force</div>
               <div class="h4 fw-bold mb-0 text-primary">{{ totalWorkers }}</div>
            </div>
          </div>
        </div>

        <!-- Search & Filter Bar (Polished) -->
        <div class="filter-section p-3 mb-4 d-flex align-items-center gap-3">
          <div class="flex-grow-1 position-relative">
            <i class="bi bi-search search-icon"></i>
            <input type="text" 
                   class="form-control q-input ps-5" 
                   placeholder="Search by worker name..." 
                   [(ngModel)]="nameSearch"
                   (ngModelChange)="onNameSearch($event)">
          </div>
          <div class="filter-dropdown">
            <select class="form-select q-select" 
                    [(ngModel)]="roleFilter"
                    (ngModelChange)="onRoleFilter($event)">
              <option value="">All Roles</option>
              <option value="Driver">Driver</option>
              <option value="Conductor">Conductor</option>
              <option value="Cleaner">Cleaner</option>
            </select>
          </div>
        </div>

        <!-- Unified Workers Table -->
        <div class="q-table-container animate__animated animate__fadeInUp">
          <div class="table-header-box d-flex justify-content-between align-items-center">
            <h6 class="table-title">Staff Roster</h6>
          </div>
          <div class="table-responsive">
            <table class="q-table m-0">
              <thead>
                <tr>
                  <th class="ps-4">Worker Name</th>
                  <th>Role</th>
                  <th>Contact Number</th>
                  <th class="text-end">Wallet Balance</th>
                  <th class="text-center">Command</th>
                </tr>
              </thead>
              <tbody *ngIf="workers$ | async as workers">
                <tr *ngFor="let staff of workers" class="q-tr-hover">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <div class="icon-avatar" [ngClass]="getRoleClass(staff.role)">
                        <i [ngClass]="getRoleIcon(staff.role)"></i>
                      </div>
                      <div class="worker-name">{{ staff.name }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="badge role-badge" [ngClass]="getRoleBadgeClass(staff.role)">
                       {{ staff.role?.toUpperCase() }}
                    </span>
                  </td>
                  <td class="contact-text">{{ staff.mobileNumber }}</td>
                  <td class="text-end fw-bold">
                    <div 
  [class.text-danger]="staff?.totalBalance! > 0"
  [class.text-success]="staff?.totalBalance === 0">
  ₹{{ staff?.totalBalance | number:'1.2-2' }}
</div>
                  </td>
                  <td class="text-center pe-4">
                    <div class="d-flex justify-content-center gap-2">
                       <button class="btn btn-icon-glass text-primary" (click)="viewWorker(staff)" title="View Analytics">
                         <i class="bi bi-eye-fill"></i>
                       </button>
                       <button class="btn btn-icon-glass text-info" [routerLink]="['/edit-staff', staff.role?.toLowerCase(), staff.id]" title="Edit Credentials">
                         <i class="bi bi-pencil-square"></i>
                       </button>
                       <button class="btn btn-icon-glass text-danger" (click)="onDelete(staff)" title="Terminate Record">
                         <i class="bi bi-trash3-fill"></i>
                       </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="workers.length === 0">
                  <td colspan="5" class="text-center py-5">
                    <div class="no-data-icon"><i class="bi bi-person-dash fs-1"></i></div>
                    <span class="no-data-text">No crew members detected matching your search.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Worker Detail Modal -->
        <div class="modal-backdrop-quantum animate__animated animate__fadeIn" *ngIf="showModal">
          <div class="modal-quantum-card animate__animated animate__zoomIn">
            <div class="modal-q-header">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-avatar-lg" [ngClass]="getRoleClass(selectedWorker?.role!)">
                  <i [ngClass]="getRoleIcon(selectedWorker?.role!)"></i>
                </div>
                <div>
                  <h4 class="mb-0 fw-bold text-white">{{ selectedWorker?.name }}</h4>
                  <span class="badge role-badge-lg" [ngClass]="getRoleBadgeClass(selectedWorker?.role!)">
                    {{ selectedWorker?.role?.toUpperCase() }}
                  </span>
                </div>
              </div>
              <button class="btn-close-q" (click)="closeModal()"><i class="bi bi-x-lg"></i></button>
            </div>
            
            <div class="modal-q-body p-4">
              <div class="row g-4">
                <div class="col-md-6">
                   <div class="info-pill-q">
                      <label>Phone Number</label>
                      <div class="value">{{ selectedWorker?.mobileNumber }}</div>
                   </div>
                </div>
                <div class="col-md-6">
                   <div class="info-pill-q">
                      <label>Wallet Balance</label>
                      <div class="value" [class.text-danger]="selectedWorker?.totalBalance! > 0">₹{{ selectedWorker?.totalBalance | number:'1.2-2' }}</div>
                   </div>
                </div>
                
                <div class="col-12 mt-4">
                   <div class="attendance-card-q">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                         <div class="label-q"><i class="bi bi-calendar-check me-2"></i> MONTHLY ATTENDANCE</div>
                         <div class="month-label-q">{{ currentMonthName }} {{ currentYear }}</div>
                      </div>
                      
                      <div class="d-flex align-items-baseline gap-2">
                         <div class="attendance-value-q">{{ attendanceCount }}</div>
                         <div class="attendance-total-q">/ {{ daysInMonth }} days</div>
                      </div>
                      
                      <div class="progress-q mt-3">
                         <div class="progress-bar-q" [style.width.%]="(attendanceCount / daysInMonth) * 100"></div>
                      </div>
                      <p class="x-small-q mt-2 opacity-50">Total duty records detected for the current month.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .quantum-title { font-family: 'Outfit', sans-serif; letter-spacing: -1px; font-size: 2.25rem; }
    .stat-badge { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; }
    
    /* Standardized Heights & Unified Styling */
    .filter-section {
      background: var(--q-glass);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
    }

    .q-input, .q-select {
      height: 52px !important;
      border-radius: 12px !important;
      background: rgba(15, 23, 42, 0.6) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
    }

    .q-input:focus, .q-select:focus {
      border-color: var(--q-primary) !important;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: 1.25rem;
      transform: translateY(-50%);
      opacity: 0.4;
      font-size: 1.1rem;
      pointer-events: none;
    }

    .filter-dropdown { min-width: 220px; }

    /* Table Enhancements */
    .q-table-container {
      background: var(--q-glass);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      overflow: hidden;
    }

    .table-header-box {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
    }

    .table-title {
      font-family: 'Outfit', sans-serif;
      margin-bottom: 0;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 0.8rem;
    }

    .q-table th {
      padding: 1.25rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;
    }

    .q-tr-hover { transition: all 0.2s ease; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
    .q-tr-hover:hover { background: rgba(255, 255, 255, 0.03); }
    .q-tr-hover td { padding: 1.25rem 1rem; border: none; vertical-align: middle; }

    .worker-name { font-family: 'Inter', sans-serif; font-weight: 600; color: white; }
    .contact-text { font-family: 'Inter', sans-serif; font-size: 0.85rem; opacity: 0.6; letter-spacing: 0.5px; }

    .icon-avatar {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .role-badge {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      padding: 0.5rem 1rem;
      letter-spacing: 0.5px;
      font-size: 0.7rem;
    }

    .btn-icon-glass {
      width: 40px; height: 40px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .btn-icon-glass:hover { transform: translateY(-3px) scale(1.1); background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }

    .no-data-icon { opacity: 0.2; transform: scale(1.2); transition: all 0.5s ease; }
    .no-data-text { color: rgba(255, 255, 255, 0.3); font-size: 0.75rem; font-weight: 500; font-family: 'Inter', sans-serif; }
    .x-small { font-size: 0.7rem; }

    /* Quantum Modal Styling */
    .modal-backdrop-quantum {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(5, 10, 24, 0.85);
      backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .modal-quantum-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      width: 100%; max-width: 550px;
      border-radius: 32px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
    }
    .modal-q-header { padding: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); position: relative; display: flex; justify-content: space-between; align-items: flex-start; }
    .icon-avatar-lg { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
    .role-badge-lg { padding: 0.4rem 0.8rem; font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; margin-top: 0.5rem; }
    .btn-close-q { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .btn-close-q:hover { background: rgba(255, 50, 50, 0.2); border-color: rgba(255, 50, 50, 0.3); color: #ff4444; }

    .info-pill-q { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 1.25rem; border-radius: 20px; }
    .info-pill-q label { font-size: 0.65rem; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.5rem; }
    .info-pill-q .value { font-size: 1.1rem; font-weight: 700; color: white; }

    .attendance-card-q { background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.03) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; padding: 1.75rem; }
    .label-q { font-size: 0.75rem; font-weight: 800; letter-spacing: 1.5px; color: var(--q-primary); }
    .month-label-q { font-size: 0.75rem; font-weight: 700; opacity: 0.4; color: white; }
    .attendance-value-q { font-size: 3.5rem; font-weight: 900; line-height: 1; color: white; }
    .attendance-total-q { font-size: 1.25rem; font-weight: 600; opacity: 0.4; color: white; }
    
    .progress-q { height: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; }
    .progress-bar-q { height: 100%; background: linear-gradient(90deg, var(--q-primary), #60a5fa); border-radius: 10px; }
    .x-small-q { font-size: 0.65rem; }
  `]
})
export class WorkerListComponent implements OnInit, OnDestroy {
  workers$: Observable<StaffMember[]>;
  totalWorkers: number = 0;

  roleFilter: string = '';
  nameSearch: string = '';

  private roleFilter$ = new BehaviorSubject<string>('');
  private nameSearch$ = new BehaviorSubject<string>('');
  private refresh$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  constructor(private staffService: StaffService) {
    // Definining the worker list as a strictly reactive stream
    this.workers$ = combineLatest([
      this.roleFilter$,
      this.nameSearch$.pipe(debounceTime(300), distinctUntilChanged()),
      this.refresh$
    ]).pipe(
      switchMap(([role, name]) => this.staffService.getWorkers(role, name)),
      tap(workers => {
        // Update total workers count only if no filters are active
        if (!this.roleFilter$.value && !this.nameSearch$.value) {
          this.totalWorkers = workers.length;
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // Explicitly update total workers count on initial load for completeness
    this.staffService.getWorkers().subscribe(workers => {
      this.totalWorkers = workers.length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRoleFilter(value: string): void {
    this.roleFilter$.next(value);
  }

  onNameSearch(value: string): void {
    this.nameSearch$.next(value);
  }

  // Modal logic
  showModal: boolean = false;
  selectedWorker: StaffMember | null = null;
  attendanceCount: number = 0;
  daysInMonth: number = 31;
  currentMonthName: string = '';
  currentYear: number = 2026;

  viewWorker(staff: StaffMember): void {
    this.selectedWorker = staff;
    this.showModal = true;
    
    // Set current date context
    const now = new Date();
    this.currentMonthName = now.toLocaleString('default', { month: 'long' });
    this.currentYear = now.getFullYear();
    this.daysInMonth = new Date(this.currentYear, now.getMonth() + 1, 0).getDate();
    
    // Immediate reactive calculation
    this.calculateAttendance(staff.name, staff.role);
  }

  calculateAttendance(name: string, role: string): void {
    this.attendanceCount = 0; // Reset
    this.staffService.getMonthlyAttendance(name, role).subscribe(count => {
       this.attendanceCount = count;
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedWorker = null;
  }

  onDelete(staff: StaffMember): void {
    if (confirm(`Are you sure you want to delete ${staff.role} ${staff.name}?`)) {
      let obs: Observable<any>;
      if (staff.role === 'Driver') obs = this.staffService.deleteDriver(staff.id!);
      else if (staff.role === 'Conductor') obs = this.staffService.deleteConductor(staff.id!);
      else obs = this.staffService.deleteCleaner(staff.id!);

      obs.subscribe({
        next: () => {
          // Trigger data refresh and global staff list update
          this.refresh$.next();
          this.staffService.refreshStaffList();

          // Ensure total workers count is updated from global list
          this.staffService.getWorkers().subscribe(fullList => {
            this.totalWorkers = fullList.length;
          });
        }
      });
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'Driver': return 'bg-warning text-dark';
      case 'Conductor': return 'bg-info text-white';
      case 'Cleaner': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'Driver': return 'bi bi-person-fill';
      case 'Conductor': return 'bi bi-person-badge-fill';
      case 'Cleaner': return 'bi bi-stars';
      default: return 'bi bi-person';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Driver': return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20';
      case 'Conductor': return 'bg-info bg-opacity-10 text-info border border-info border-opacity-20';
      case 'Cleaner': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-20';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }
}
