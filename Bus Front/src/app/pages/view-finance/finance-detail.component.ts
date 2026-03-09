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
    <div class="page-wrapper dashboard-glamor">
      <div class="container py-lg-4 animate__animated animate__fadeIn">
        
        <!-- Navigation & Actions -->
        <div class="d-flex justify-content-between align-items-center mb-5">
          <button class="btn btn-icon-glass px-4 py-2 w-auto d-flex align-items-center gap-2" routerLink="/view">
            <i class="bi bi-chevron-left x-small"></i> 
            <span class="x-small tracking-widest text-uppercase fw-bold">Back to Archives</span>
          </button>
          
          <div *ngIf="record && !loading" class="d-flex gap-2">
             <button class="btn btn-pdf-glass px-4 py-2" (click)="onDownloadPDF()" [disabled]="pdfLoading">
                <span *ngIf="pdfLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!pdfLoading" class="bi bi-file-earmark-pdf-fill text-danger me-2"></i> 
                <span class="small fw-bold text-uppercase tracking-wider">Download Report</span>
             </button>
             <a [routerLink]="['/add', record.id]" class="btn btn-modify-glow px-4 py-2">
               <i class="bi bi-pencil-square me-2"></i> Modify Statement
             </a>
          </div>
        </div>

        <div *ngIf="record && !loading" class="statement-canvas">
          <!-- Statement Header focal point -->
          <div class="text-center mb-5 mt-2">
             <div class="stat-pill-glamor d-inline-flex mb-3">
                <i class="bi bi-shield-check me-2 text-primary"></i> OFFICIAL STATEMENT
             </div>
             <h1 class="quantum-headline fw-black text-white mb-2">Daily Financial Report</h1>
             
             <!-- Date Focal Badge -->
             <div class="date-focal-container d-flex justify-content-center align-items-center gap-4 mt-4">
                <div class="date-focal-badge">
                   <div class="day">{{ record.date | date:'dd' }}</div>
                   <div class="month">{{ record.date | date:'MMM' }}</div>
                </div>
                <div class="text-start">
                   <div class="h4 mb-0 fw-bold text-white tracking-tight">{{ record.date | date:'EEEE' }}, {{ record.date | date:'yyyy' }}</div>
                   <div class="x-small text-uppercase tracking-widest text-primary fw-800">Statement ID: #{{ record.id }}</div>
                </div>
             </div>
          </div>

          <!-- Personnel Performance Hub -->
          <div class="row g-4 mb-5 px-xl-5">
            <!-- Driver Hub -->
            <div class="col-lg-4 col-md-6">
              <div class="hub-card-glamor border-driver shadow-driver h-100">
                <div class="hub-header-glamor">
                  <div class="hub-icon-box bg-driver-dim text-driver"><i class="bi bi-person-fill"></i></div>
                  <div class="hub-meta">
                    <div class="hub-label">DRIVER</div>
                    <div class="hub-status"><i class="bi bi-circle-fill text-driver"></i></div>
                  </div>
                </div>
                <div class="hub-content p-4 pt-2">
                  <div class="mb-3">
                    <div class="label-nano opacity-40">Personnel Name</div>
                    <div class="h5 mb-0 fw-bold text-white">{{ record.driverName }}</div>
                  </div>
                  <div class="hub-data-shelf p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="label-nano text-uppercase opacity-50">Salary Paid</span>
                      <span class="fw-bold text-white fs-4">₹{{ record.driverSalaryPaid | number:'1.2-2' }}</span>
                    </div>
                    <div class="hub-data-divider"></div>
                    <div class="d-flex justify-content-between align-items-center pt-2">
                      <span class="label-nano text-uppercase opacity-50">Balance</span>
                      <span class="fw-bold fs-5" [class.text-danger]="(record.driverBalanceSalary ?? 0) > 0" [class.text-success]="(record.driverBalanceSalary ?? 0) === 0">
                        ₹{{ record.driverBalanceSalary | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Conductor Hub -->
            <div class="col-lg-4 col-md-6">
              <div class="hub-card-glamor border-conductor shadow-conductor h-100">
                <div class="hub-header-glamor">
                  <div class="hub-icon-box bg-conductor-dim text-conductor"><i class="bi bi-person-badge-fill"></i></div>
                  <div class="hub-meta">
                    <div class="hub-label">CONDUCTOR</div>
                    <div class="hub-status"><i class="bi bi-circle-fill text-conductor"></i></div>
                  </div>
                </div>
                <div class="hub-content p-4 pt-2">
                  <div class="mb-3">
                    <div class="label-nano opacity-40">Personnel Name</div>
                    <div class="h5 mb-0 fw-bold text-white">{{ record.conductorName }}</div>
                  </div>
                  <div class="hub-data-shelf p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="label-nano text-uppercase opacity-50">Salary Paid</span>
                      <span class="fw-bold text-white fs-4">₹{{ record.conductorSalaryPaid | number:'1.2-2' }}</span>
                    </div>
                    <div class="hub-data-divider"></div>
                    <div class="d-flex justify-content-between align-items-center pt-2">
                      <span class="label-nano text-uppercase opacity-50">Balance</span>
                      <span class="fw-bold fs-5" [class.text-danger]="(record.conductorBalanceSalary ?? 0) > 0" [class.text-success]="(record.conductorBalanceSalary ?? 0) === 0">
                        ₹{{ record.conductorBalanceSalary | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cleaner Hub -->
            <div class="col-lg-4 col-md-12">
              <div class="hub-card-glamor border-cleaner shadow-cleaner h-100">
                <div class="hub-header-glamor">
                  <div class="hub-icon-box bg-cleaner-dim text-cleaner"><i class="bi bi-stars"></i></div>
                  <div class="hub-meta">
                    <div class="hub-label">CLEANER</div>
                    <div class="hub-status"><i class="bi bi-circle-fill text-cleaner"></i></div>
                  </div>
                </div>
                <div class="hub-content p-4 pt-2">
                  <div class="mb-3">
                    <div class="label-nano opacity-40">Personnel Name</div>
                    <div class="h5 mb-0 fw-bold text-white">{{ record.cleanerName }}</div>
                  </div>
                  <div class="hub-data-shelf p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="label-nano text-uppercase opacity-50">Amt. Paid (Padi)</span>
                      <span class="fw-bold text-success fs-4">₹{{ record.cleanerPadi | number:'1.2-2' }}</span>
                    </div>
                    <div class="hub-data-divider"></div>
                    <div class="d-flex justify-content-between align-items-center pt-2">
                      <span class="label-nano text-uppercase opacity-50">Balance</span>
                      <span class="fw-bold fs-5" [class.text-danger]="(record.cleanerBalanceSalary ?? 0) > 0" [class.text-success]="(record.cleanerBalanceSalary ?? 0) === 0">
                        ₹{{ record.cleanerBalanceSalary | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction Details Breakdown -->
          <div class="row g-4 mb-5 px-xl-5">
             <div class="col-12">
                <div class="glamor-table-card">
                   <div class="p-4 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center">
                      <h6 class="mb-0 fw-black text-white-50 text-uppercase tracking-widest small">Audit Summary</h6>
                      <div class="d-flex align-items-center gap-2">
                         <span class="badge bg-primary bg-opacity-10 text-primary x-small fw-800">Values in INR (₹)</span>
                      </div>
                   </div>
                   <div class="table-responsive">
                     <table class="q-table-glamor m-0 w-100 text-white">
                        <tbody>
                           <tr>
                              <td class="ps-4 py-4 w-50">
                                 <div class="fw-bold text-white fs-6">Total Collections</div>
                                 <div class="x-small opacity-30">Ticket sales and revenue from all sources</div>
                              </td>
                              <td class="text-end pe-4 py-4 fw-black fs-3 text-primary">₹{{ record.totalCollection | number:'1.2-2' }}</td>
                           </tr>
                           <tr>
                              <td class="ps-4 py-4">
                                 <div class="fw-bold text-white fs-6">Fuel Consumption (Diesel)</div>
                                 <div class="x-small opacity-30">{{ record.dieselLiters }} Liters @ ₹{{ record.dieselPricePerLiter }}/L</div>
                              </td>
                              <td class="text-end pe-4 py-4 fw-bold fs-5 text-white">₹{{ record.dieselExpense | number:'1.2-2' }}</td>
                           </tr>
                           <tr>
                              <td class="ps-4 py-4">
                                 <div class="fw-bold text-white fs-6">Others</div>
                                 <div class="x-small opacity-30">Association Fee + Poo Selavu (Misc)</div>
                              </td>
                              <td class="text-end pe-4 py-4 fw-bold fs-5 text-white">₹{{ (record.unionFee + record.pooSelavu) | number:'1.2-2' }}</td>
                           </tr>
                        </tbody>
                     </table>
                   </div>
                </div>
             </div>
          </div>

          <!-- Statement Net Performance Summary -->
          <div class="profit-box-glamor p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mx-xl-5">
            <div class="text-center text-md-start">
              <div class="profit-label-glamor fw-black text-primary text-uppercase tracking-widest">Net Profit Performance</div>
              <p class="mb-0 small opacity-40 mt-1">Final profit after operational and personnel expenditure</p>
            </div>
            <div class="text-end">
              <div class="profit-value-glamor" [class.text-danger]="(record.balance ?? 0) < 0" [class.text-success]="(record.balance ?? 0) >= 0">
                ₹{{ record.balance | number:'1.2-2' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Loading / Error States -->
        <div class="text-center py-5" *ngIf="loading">
           <div class="loader-glamor mb-4 mx-auto"></div>
           <p class="text-white opacity-40 fw-800 x-small text-uppercase tracking-widest">Encrypting Statement Streams...</p>
        </div>

        <div class="glass-card p-5 border-danger border-opacity-10 bg-danger bg-opacity-5 text-center mx-auto mt-5" *ngIf="error && !loading" style="max-width: 500px;">
           <i class="bi bi-shield-slash-fill text-danger fs-1 mb-3 d-block"></i>
           <h4 class="fw-black text-white mb-2">Statement Retrieval Error</h4>
           <p class="text-white opacity-40 small mb-4">The requested records could not be securely retrieved. They might have been archived or purged from active storage.</p>
           <button class="btn btn-modify-glow px-5 py-3" (click)="loadRecord(currentId)">
             <i class="bi bi-arrow-clockwise me-2"></i> Attempt Re-sync
           </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-glamor {
       background: radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
       min-height: 100vh;
    }

    .quantum-headline { font-family: 'Outfit', sans-serif; font-size: 3.2rem; letter-spacing: -1.5px; }
    .fw-800 { font-weight: 800; }
    .fw-black { font-weight: 900; }

    .stat-pill-glamor {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.4rem 1.25rem;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--q-primary);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    /* Date Focal Badge centered */
    .date-focal-badge {
      width: 90px; height: 90px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      position: relative;
    }
    .date-focal-badge::before {
       content: ''; position: absolute; inset: -1px; border-radius: 24px;
       padding: 1px; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
       -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
       -webkit-mask-composite: xor; mask-composite: exclude;
    }
    .date-focal-badge .day { font-weight: 900; font-size: 2.2rem; line-height: 1; color: #fff; }
    .date-focal-badge .month { font-size: 0.9rem; text-transform: uppercase; color: var(--q-primary); font-weight: 900; margin-top: -2px; }

    /* Glamor Cards */
    .hub-card-glamor {
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 28px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }
    .hub-card-glamor:hover {
        transform: translateY(-8px) scale(1.02);
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .hub-header-glamor { padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
    .hub-icon-box {
        width: 48px; height: 48px;
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
    }
    .hub-meta { flex: 1; display: flex; justify-content: space-between; align-items: center; }
    .hub-label { font-size: 0.75rem; font-weight: 900; letter-spacing: 2px; color: var(--q-text-muted); }
    .hub-status { font-size: 0.5rem; filter: drop-shadow(0 0 5px currentColor); }

    /* Personnel Themes */
    .text-driver { color: var(--q-accent); }
    .bg-driver-dim { background: rgba(255, 122, 0, 0.1); }
    .border-driver { border-top: 4px solid var(--q-accent) !important; }
    .shadow-driver:hover { box-shadow: 0 15px 40px rgba(255, 122, 0, 0.15); }

    .text-conductor { color: var(--q-primary); }
    .bg-conductor-dim { background: rgba(59, 130, 246, 0.1); }
    .border-conductor { border-top: 4px solid var(--q-primary) !important; }
    .shadow-conductor:hover { box-shadow: 0 15px 40px rgba(59, 130, 246, 0.15); }

    .text-cleaner { color: var(--q-success); }
    .bg-cleaner-dim { background: rgba(16, 185, 129, 0.1); }
    .border-cleaner { border-top: 4px solid var(--q-success) !important; }
    .shadow-cleaner:hover { box-shadow: 0 15px 40px rgba(16, 185, 129, 0.15); }

    .hub-data-shelf {
       background: rgba(0, 0, 0, 0.2);
       border: 1px solid rgba(255, 255, 255, 0.03);
       border-radius: 20px;
       box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
    }
    .hub-data-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0.25rem 0; }

    /* Audit Table Glamor */
    .glamor-table-card {
       background: rgba(255, 255, 255, 0.02);
       backdrop-filter: blur(12px);
       border: 1px solid rgba(255, 255, 255, 0.05);
       border-radius: 28px;
       overflow: hidden;
    }
    .q-table-glamor tbody tr td { 
       border-bottom: 1px solid rgba(255, 255, 255, 0.03); 
       transition: background 0.2s ease;
    }
    .q-table-glamor tbody tr:last-child td { border-bottom: none; }
    .q-table-glamor tbody tr:hover td { background: rgba(255,255,255,0.01); }

    /* Profit Box Glamor */
    .profit-box-glamor {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 122, 0, 0.05) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 30px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
    }
    .profit-box-glamor::after {
       content: ''; position: absolute; top: 0; right: 0; width: 300px; height: 300px;
       background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
       z-index: -1; pointer-events: none;
    }
    .profit-label-glamor { font-size: 0.8rem; font-weight: 900; }
    .profit-value-glamor { font-size: 4rem; font-weight: 900; letter-spacing: -2px; line-height: 1; mask-image: linear-gradient(#000 70%, transparent); }

    /* Global Utils */
    .label-nano { font-size: 0.65rem; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }
    .btn-icon-glass, .btn-pdf-glass {
       background: rgba(255, 255, 255, 0.03);
       border: 1px solid rgba(255, 255, 255, 0.08);
       color: #fff; border-radius: 14px;
       transition: all 0.3s ease;
    }
    .btn-icon-glass:hover, .btn-pdf-glass:hover {
       background: rgba(255, 255, 255, 0.08);
       border-color: rgba(255, 255, 255, 0.2);
       transform: translateX(-3px);
    }
    .btn-modify-glow {
       background: var(--q-accent);
       color: #fff; border: none; border-radius: 14px;
       font-weight: 700;
       box-shadow: 0 8px 25px rgba(255, 122, 0, 0.3);
       transition: all 0.3s ease;
    }
    .btn-modify-glow:hover {
       transform: translateY(-2px);
       box-shadow: 0 12px 35px rgba(255, 122, 0, 0.5);
    }

    .loader-glamor {
       width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.05);
       border-top-color: var(--q-primary); border-radius: 50%;
       animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .x-small { font-size: 0.7rem; }
  `]
})
export class FinanceDetailComponent implements OnInit {
  record?: DailyFinance;
  loading = true;
  pdfLoading = false;
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

    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    }, 10000);
  }

  onDownloadPDF(): void {
    if (!this.record) return;

    this.pdfLoading = true;
    this.financeService.downloadFinancePdf(this.currentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Daily_Report_${this.record?.date}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.pdfLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('PDF Download Error:', err);
        this.pdfLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

