import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, tap, map } from 'rxjs';
import { Driver, Conductor, StaffMember } from '../models/staff.model';
import { FinanceService } from './finance.service';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private apiUrl = '/api/staff';

    private staffSubject = new BehaviorSubject<StaffMember[]>([]);
    staff$ = this.staffSubject.asObservable();

    constructor(
        private http: HttpClient,
        private financeService: FinanceService
    ) {
        this.refreshStaffList();
    }

    refreshStaffList(): void {
        forkJoin({
            drivers: this.getDrivers(),
            conductors: this.getConductors(),
            finances: this.financeService.getAllFinance()
        }).pipe(
            map(({ drivers, conductors, finances }) => {
                // Pre-calculate balances per staff name
                const balanceMap = new Map<string, number>();

                finances.forEach(f => {
                    // Update for Driver
                    const currentDriverBal = balanceMap.get(f.driverName) || 0;
                    balanceMap.set(f.driverName, currentDriverBal + (f.driverBalanceSalary || 0));

                    // Update for Conductor
                    const currentConductorBal = balanceMap.get(f.conductorName) || 0;
                    balanceMap.set(f.conductorName, currentConductorBal + (f.conductorBalanceSalary || 0));
                });

                const combined: StaffMember[] = [
                    ...drivers.map(d => ({
                        ...d,
                        role: 'Driver' as const,
                        totalBalance: balanceMap.get(d.name) || 0
                    })),
                    ...conductors.map(c => ({
                        ...c,
                        role: 'Conductor' as const,
                        totalBalance: balanceMap.get(c.name) || 0
                    }))
                ];
                return combined;
            })
        ).subscribe(staff => this.staffSubject.next(staff));
    }

    // Drivers
    getDrivers(): Observable<Driver[]> {
        return this.http.get<Driver[]>(`${this.apiUrl}/drivers`, { withCredentials: true });
    }

    getDriverById(id: number): Observable<Driver> {
        return this.http.get<Driver>(`${this.apiUrl}/drivers/${id}`, { withCredentials: true });
    }

    addDriver(driver: Driver): Observable<Driver> {
        return this.http.post<Driver>(`${this.apiUrl}/drivers`, driver, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    updateDriver(id: number, driver: Driver): Observable<Driver> {
        return this.http.put<Driver>(`${this.apiUrl}/drivers/${id}`, driver, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    deleteDriver(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/drivers/${id}`, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    // Conductors
    getConductors(): Observable<Conductor[]> {
        return this.http.get<Conductor[]>(`${this.apiUrl}/conductors`, { withCredentials: true });
    }

    getConductorById(id: number): Observable<Conductor> {
        return this.http.get<Conductor>(`${this.apiUrl}/conductors/${id}`, { withCredentials: true });
    }

    addConductor(conductor: Conductor): Observable<Conductor> {
        return this.http.post<Conductor>(`${this.apiUrl}/conductors`, conductor, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    updateConductor(id: number, conductor: Conductor): Observable<Conductor> {
        return this.http.put<Conductor>(`${this.apiUrl}/conductors/${id}`, conductor, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    deleteConductor(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/conductors/${id}`, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }
}
