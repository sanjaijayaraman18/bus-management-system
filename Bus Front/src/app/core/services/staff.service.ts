import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, tap, map } from 'rxjs';
import { Driver, Conductor, Cleaner, StaffMember } from '../models/staff.model';
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
            cleaners: this.getCleaners(),
            finances: this.financeService.getAllFinance()
        }).pipe(
            map(({ drivers, conductors, cleaners, finances }) => {
                // Pre-calculate balances per staff name
                const balanceMap = new Map<string, number>();

                finances.forEach(f => {
                    // Update for Driver
                    const currentDriverBal = balanceMap.get(f.driverName) || 0;
                    balanceMap.set(f.driverName, currentDriverBal + (f.driverBalanceSalary || 0));

                    // Update for Conductor
                    const currentConductorBal = balanceMap.get(f.conductorName) || 0;
                    balanceMap.set(f.conductorName, currentConductorBal + (f.conductorBalanceSalary || 0));

                    // Note: Cleaner doesn't have "balance" requirement in the prompt, 
                    // but we can track total paid if needed. The prompt just says "Show the Cleaner Amount".
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
                    })),
                    ...cleaners.map(cl => ({
                        ...cl,
                        role: 'Cleaner' as const,
                        totalBalance: cl.walletBalance || 0
                    }))
                ];
                return combined;
            })
        ).subscribe(staff => this.staffSubject.next(staff));
    }

    getCleaners(): Observable<Cleaner[]> {
        return this.http.get<Cleaner[]>(`${this.apiUrl}/cleaners`, { withCredentials: true });
    }

    getCleanerById(id: number): Observable<Cleaner> {
        return this.http.get<Cleaner>(`${this.apiUrl}/cleaners/${id}`, { withCredentials: true });
    }

    addCleaner(cleaner: Cleaner): Observable<Cleaner> {
        return this.http.post<Cleaner>(`${this.apiUrl}/cleaners`, cleaner, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    updateCleaner(id: number, cleaner: Cleaner): Observable<Cleaner> {
        return this.http.put<Cleaner>(`${this.apiUrl}/cleaners/${id}`, cleaner, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
    }

    deleteCleaner(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cleaners/${id}`, { withCredentials: true }).pipe(
            tap(() => this.refreshStaffList())
        );
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

    getWorkers(role?: string, name?: string): Observable<StaffMember[]> {
        let params = new HttpParams();
        if (role) params = params.set('role', role);
        if (name) params = params.set('name', name);
        return this.http.get<StaffMember[]>(`${this.apiUrl}/all`, { params, withCredentials: true });
    }
}

