import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
    id?: number;
    routeName: string;
    startLocation: string;
    endLocation: string;
    distance: number;
    driverSalary: number;
    conductorSalary: number;
    cleanerSalary: number;
}


@Injectable({
    providedIn: 'root'
})
export class RouteService {
    private readonly API_URL = '/api/routes';

    constructor(private http: HttpClient) { }

    createRoute(route: Route): Observable<Route> {
        return this.http.post<Route>(this.API_URL, route);
    }

    getAllRoutes(): Observable<Route[]> {
        return this.http.get<Route[]>(this.API_URL);
    }

    getRouteNames(): Observable<Route[]> {
        return this.http.get<Route[]>(`${this.API_URL}/names`);
    }

    getRouteById(id: number): Observable<Route> {
        return this.http.get<Route>(`${this.API_URL}/${id}`);
    }

    deleteRoute(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
