import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary, DashboardData } from '../../core/models/dashboard.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header animate__animated animate__fadeInDown">
        <div class="container py-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h2 mb-0">Finance Overview</h1>
            <p class="text-muted small mb-0">Live tracking of Bramma Transport daily records</p>
          </div>
          <div class="actions">
            <button (click)="loadData()" class="btn btn-light btn-sm border me-2">
              <i class="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
            <a routerLink="/add" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-lg me-1"></i> New Record
            </a>
          </div>
        </div>
      </div>

      <div class="container py-4">
        <!-- Error Alert -->
        <div *ngIf="error" class="alert alert-danger mb-4 d-flex align-items-center">
          <i class="bi bi-exclamation-octagon-fill me-2 fs-4"></i>
          <div>
            <strong>Failed to load dashboard data.</strong> 
            Please check your connection or backend status.
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-4 mb-5 animate__animated animate__fadeInUp">
          <div *ngFor="let card of summaryCards" class="col-md-3">
            <div class="card summary-card" [ngClass]="card.class">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="icon-box"><i class="bi" [class]="card.icon"></i></div>
                  <span class="badge bg-white bg-opacity-25 rounded-pill px-3">Monthly</span>
                </div>
                <h6 class="text-white opacity-75 mb-1">{{ card.label }}</h6>
                <h3 class="text-white mb-0 fw-bold">₹{{ card.value | number:'1.2-2' }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="row g-4 mb-5">
          <div class="col-md-7">
            <div class="card panel-card h-100 border-0 shadow-sm p-4">
              <h5 class="mb-4 fw-bold">Financial Income (Monthly)</h5>
              <div class="chart-wrapper">
                <canvas #barChart></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="card panel-card h-100 border-0 shadow-sm p-4">
              <h5 class="mb-4 fw-bold">Expense Trends</h5>
              <div class="chart-wrapper">
                <canvas #lineChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Actions -->
        <div class="row g-4">
          <div class="col-md-12">
            <h5 class="mb-4 fw-bold text-muted text-uppercase small ls-1 text-center">Management Console</h5>
          </div>
          
          <div class="col-md-3">
            <a routerLink="/add-driver" class="nav-card text-center justify-content-center flex-column py-4">
              <div class="mb-3 fs-2 text-primary p-3 bg-primary bg-opacity-10 rounded-circle d-inline-block">
                <i class="bi bi-person-plus-fill"></i>
              </div>
              <h6>Add Driver</h6>
              <p class="small text-muted mb-0">Register new driver details</p>
            </a>
          </div>

          <div class="col-md-3">
            <a routerLink="/add-conductor" class="nav-card text-center justify-content-center flex-column py-4">
              <div class="mb-3 fs-2 text-info p-3 bg-info bg-opacity-10 rounded-circle d-inline-block">
                <i class="bi bi-person-vcard"></i>
              </div>
              <h6>Add Conductor</h6>
              <p class="small text-muted mb-0">Register new conductor info</p>
            </a>
          </div>

          <div class="col-md-3">
            <a routerLink="/add" class="nav-card text-center justify-content-center flex-column py-4">
              <div class="mb-3 fs-2 text-warning p-3 bg-warning bg-opacity-10 rounded-circle d-inline-block">
                <i class="bi bi-calculator-fill"></i>
              </div>
              <h6>Daily Finance</h6>
              <p class="small text-muted mb-0">Add collection & expense</p>
            </a>
          </div>

          <div class="col-md-3">
            <a routerLink="/staff-list" class="nav-card text-center justify-content-center flex-column py-4">
              <div class="mb-3 fs-2 text-danger p-3 bg-danger bg-opacity-10 rounded-circle d-inline-block">
                <i class="bi bi-people-fill"></i>
              </div>
              <h6>Staff List</h6>
              <p class="small text-muted mb-0">Unified staff management</p>
            </a>
          </div>
        </div>
      </div>
    
  `,
  styles: [`
    .dashboard-container {
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .dashboard-header {
      background: #fff;
      border-bottom: 1px solid #eee;
    }

    .summary-card {
      border: none;
      border-radius: 20px;
      color: white;
      transition: transform 0.3s ease;
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }
    .summary-card:hover { transform: translateY(-8px); }

    .bg-collection { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .bg-diesel { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .bg-salary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .bg-balance { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

    .icon-box {
      width: 45px; height: 45px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem;
    }

    .panel-card { border-radius: 20px; }
    
    .chart-wrapper {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .nav-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: #fff;
      border-radius: 18px;
      text-decoration: none;
      color: inherit;
      border: 1px solid transparent;
      transition: all 0.3s ease;
    }
    .nav-card:hover { 
      border-color: #dee2e6;
      box-shadow: 0 10px 15px rgba(0,0,0,0.05);
      transform: translateY(-3px);
    }
    .nav-card.active { background: #f0f7ff; border-color: #cfe2ff; }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('barChart') barChartCanvas!: ElementRef;
  @ViewChild('lineChart') lineChartCanvas!: ElementRef;

  loading = true;
  error = false;
  summaryCards = [
    { label: 'Today Collection', value: 0, icon: 'bi-wallet2', class: 'bg-collection' },
    { label: 'Diesel Expense', value: 0, icon: 'bi-fuel-pump', class: 'bg-diesel' },
    { label: 'Salary Paid', value: 0, icon: 'bi-cash-coin', class: 'bg-salary' },
    { label: 'Net Balance', value: 0, icon: 'bi-piggy-bank', class: 'bg-balance' }
  ];

  private barChart: any;
  private lineChart: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = false;

    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.updateSummaryCards(data.summary);
        setTimeout(() => this.initCharts(data), 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  private updateSummaryCards(summary: DashboardSummary): void {
    this.summaryCards[0].value = summary.todayCollection;
    this.summaryCards[1].value = summary.todayDiesel;
    this.summaryCards[2].value = summary.todaySalary;
    this.summaryCards[3].value = summary.netBalance;
  }

  private initCharts(data: DashboardData): void {
    if (this.barChart) this.barChart.destroy();
    if (this.lineChart) this.lineChart.destroy();

    const barCtx = this.barChartCanvas.nativeElement.getContext('2d');
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: data.monthlyIncome.map(d => d.label),
        datasets: [{
          label: 'Monthly Income',
          data: data.monthlyIncome.map(d => d.value),
          backgroundColor: '#4facfe',
          borderRadius: 8
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    const lineCtx = this.lineChartCanvas.nativeElement.getContext('2d');
    this.lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: data.financialTrends.map(d => d.month),
        datasets: [
          {
            label: 'Income',
            data: data.financialTrends.map(d => d.income),
            borderColor: '#43e97b',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(67, 233, 123, 0.1)'
          },
          {
            label: 'Expense',
            data: data.financialTrends.map(d => d.expense),
            borderColor: '#f5576c',
            tension: 0.4
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}
