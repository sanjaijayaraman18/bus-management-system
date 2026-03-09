import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyFinance } from '../models/finance.model';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    // Relative URLs through proxy
    private readonly API_BASE_URL = '/api/finance';

    constructor(private http: HttpClient) { }

    saveFinance(finance: DailyFinance): Observable<DailyFinance> {
        return this.http.post<DailyFinance>(`${this.API_BASE_URL}/save`, finance, {
            withCredentials: true
        });
    }

    getAllFinance(): Observable<DailyFinance[]> {
        return this.http.get<DailyFinance[]>(`${this.API_BASE_URL}/all`, {
            withCredentials: true
        });
    }

    getFinanceByDate(date: string): Observable<DailyFinance[]> {
        return this.http.get<DailyFinance[]>(`${this.API_BASE_URL}/date/${date}`, {
            withCredentials: true
        });
    }

    deleteFinance(id: number): Observable<any> {
        return this.http.delete(`${this.API_BASE_URL}/delete/${id}`, {
            withCredentials: true,
            responseType: 'text'
        });
    }

    getFinanceById(id: number): Observable<DailyFinance> {
        return this.http.get<DailyFinance>(`${this.API_BASE_URL}/${id}`, {
            withCredentials: true
        });
    }

    updateFinance(id: number, finance: DailyFinance): Observable<DailyFinance> {
        return this.http.put<DailyFinance>(`${this.API_BASE_URL}/update/${id}`, finance, {
            withCredentials: true
        });
    }

    downloadFinancePdf(id: number): Observable<Blob> {
        return this.http.get(`${this.API_BASE_URL}/report/${id}/pdf`, {
            responseType: 'blob',
            withCredentials: true
        });
    }
}
