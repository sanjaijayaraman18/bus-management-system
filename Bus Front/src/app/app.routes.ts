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
    { path: 'register', loadComponent: () => import('./pages/login/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'add', component: AddFinanceComponent, canActivate: [authGuard] },
    { path: 'edit-report/:id', component: AddFinanceComponent, canActivate: [authGuard] },
    { path: 'staff-registration', loadComponent: () => import('./pages/manage-staff/staff-registration.component').then(m => m.StaffRegistrationComponent), canActivate: [authGuard] },
    { path: 'edit-staff/:role/:id', loadComponent: () => import('./pages/manage-staff/staff-registration.component').then(m => m.StaffRegistrationComponent), canActivate: [authGuard] },
    { path: 'view', component: ViewFinanceComponent, canActivate: [authGuard] },
    { path: 'report-view/:id', component: FinanceDetailComponent, canActivate: [authGuard] },
    { path: 'staff-list', loadComponent: () => import('./pages/manage-staff/staff-list.component').then(m => m.StaffListComponent), canActivate: [authGuard] },
    { path: 'worker-list', loadComponent: () => import('./pages/manage-staff/worker-list.component').then(m => m.WorkerListComponent), canActivate: [authGuard] },
    { path: 'staff-view/:role/:id', loadComponent: () => import('./pages/manage-staff/staff-detail.component').then(m => m.StaffDetailComponent), canActivate: [authGuard] },
    { path: 'add-route', loadComponent: () => import('./pages/add-route/add-route.component').then(m => m.AddRouteComponent), canActivate: [authGuard] },
    { path: 'add-bus', loadComponent: () => import('./pages/add-bus/add-bus.component').then(m => m.AddBusComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: '/dashboard' }
];
