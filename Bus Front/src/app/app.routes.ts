import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddFinanceComponent } from './pages/add-finance/add-finance.component';
import { ViewFinanceComponent } from './pages/view-finance/view-finance.component';
import { authGuard } from './core/guards/auth.guard';
import { FinanceDetailComponent } from './pages/view-finance/finance-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'add', component: AddFinanceComponent, canActivate: [authGuard] },
    { path: 'edit-report/:id', component: AddFinanceComponent, canActivate: [authGuard] },
    { path: 'add-driver', loadComponent: () => import('./pages/manage-staff/add-driver.component').then(m => m.AddDriverComponent), canActivate: [authGuard] },
    { path: 'add-conductor', loadComponent: () => import('./pages/manage-staff/add-conductor.component').then(m => m.AddConductorComponent), canActivate: [authGuard] },
    { path: 'view', component: ViewFinanceComponent, canActivate: [authGuard] },
    { path: 'report-view/:id', component: FinanceDetailComponent, canActivate: [authGuard] },
    { path: 'staff-list', loadComponent: () => import('./pages/manage-staff/staff-list.component').then(m => m.StaffListComponent), canActivate: [authGuard] },
    { path: 'staff-view/:role/:id', loadComponent: () => import('./pages/manage-staff/staff-detail.component').then(m => m.StaffDetailComponent), canActivate: [authGuard] },
    { path: 'edit-driver/:id', loadComponent: () => import('./pages/manage-staff/add-driver.component').then(m => m.AddDriverComponent), canActivate: [authGuard] },
    { path: 'edit-conductor/:id', loadComponent: () => import('./pages/manage-staff/add-conductor.component').then(m => m.AddConductorComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: '/dashboard' }
];
