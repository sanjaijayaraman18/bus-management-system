import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from './route.service';

export interface Bus {
    id?: number;
    busNumber: string;
    busName: string;
    route: Route;
}

@Injectable({
    providedIn: 'root'
})
export class BusService {
    private readonly API_URL = '/api/buses';

    constructor(private http: HttpClient) { }

    createBus(bus: any): Observable<Bus> {
        return this.http.post<Bus>(this.API_URL, bus);
    }

    getAllBuses(): Observable<Bus[]> {
        return this.http.get<Bus[]>(this.API_URL);
    }

    getBusById(id: number): Observable<Bus> {
        return this.http.get<Bus>(`${this.API_URL}/${id}`);
    }

    deleteBus(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
