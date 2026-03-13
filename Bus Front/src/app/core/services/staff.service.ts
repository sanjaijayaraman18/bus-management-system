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
            cleaners: this.getCleaners()
        }).pipe(
            map(({ drivers, conductors, cleaners }) => {
                const combined: StaffMember[] = [
                    ...drivers.map(d => ({ ...d, role: 'Driver' as const })),
                    ...conductors.map(c => ({ ...c, role: 'Conductor' as const })),
                    ...cleaners.map(cl => ({ ...cl, role: 'Cleaner' as const }))
                ];
                return combined;
            })
        ).subscribe(staff => this.staffSubject.next(staff));
    }

    getStaffHistory(name: string, role: string): Observable<any[]> {
        return this.financeService.getAllFinance().pipe(
            map(finances => {
                const history = finances
                    .filter(f => {
                        if (role === 'Driver') return f.driverName === name;
                        if (role === 'Conductor') return f.conductorName === name;
                        if (role === 'Cleaner') return f.cleanerName === name;
                        return false;
                    })
                    .map(f => ({
                        date: f.date,
                        salaryPaid: role === 'Driver' ? f.driverSalaryPaid : (role === 'Conductor' ? f.conductorSalaryPaid : f.cleanerPadi),
                        balance: role === 'Driver' ? f.driverBalanceSalary : (role === 'Conductor' ? f.conductorBalanceSalary : f.cleanerBalanceSalary),
                        routeName: f.route?.routeName || 'N/A',
                        dieselLiters: f.dieselLiters
                    }))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                return history;
            })
        );
    }

    getDieselEstimation(name: string, role: string): Observable<number> {
        return this.getStaffHistory(name, role).pipe(
            map(history => {
                const dieselRecords = history
                    .filter(h => h.dieselLiters > 0)
                    .slice(0, 5); // Last 5 duty days
                
                if (dieselRecords.length === 0) return 0;
                
                const sum = dieselRecords.reduce((acc, curr) => acc + curr.dieselLiters, 0);
                return sum / dieselRecords.length;
            })
        );
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

    getStaffDetails(role: string, id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${role.toLowerCase()}/${id}`, { withCredentials: true });
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

  deleteStaff(role: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${role.toLowerCase()}/${id}`, { withCredentials: true }).pipe(
      tap(() => this.refreshStaffList())
    );
  }

  updateStaffBalance(role: string, id: number, walletBalance: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${role.toLowerCase()}/${id}`, { walletBalance }, { withCredentials: true }).pipe(
      tap(() => this.refreshStaffList())
    );
  }

    getWorkers(role?: string, name?: string): Observable<StaffMember[]> {
        let params = new HttpParams();
        if (role) params = params.set('role', role);
        if (name) params = params.set('name', name);
        return this.http.get<StaffMember[]>(`${this.apiUrl}/all`, { params, withCredentials: true });
    }

    getMonthlyAttendance(name: string, role: string): Observable<number> {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const targetName = name.trim().toLowerCase();

        return this.financeService.getAllFinance().pipe(
            map(finances => {
                return finances.filter(f => {
                    const recordDate = new Date(f.date);
                    const isSameMonth = recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
                    
                    if (!isSameMonth) return false;

                    let fieldName = '';
                    if (role === 'Driver') fieldName = f.driverName;
                    else if (role === 'Conductor') fieldName = f.conductorName;
                    else if (role === 'Cleaner') fieldName = f.cleanerName;

                    return fieldName && fieldName.trim().toLowerCase() === targetName;
                }).length;
            })
        );
    }
}

