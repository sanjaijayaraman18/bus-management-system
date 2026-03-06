import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, DashboardSummary } from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly API_BASE_URL = '/api/dashboard';

    constructor(private http: HttpClient) { }

    getDashboardData(): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${this.API_BASE_URL}/all`, {
            withCredentials: true
        });
    }

    getSummary(): Observable<DashboardSummary> {
        return this.http.get<DashboardSummary>(`${this.API_BASE_URL}/summary`, {
            withCredentials: true
        });
    }
}
