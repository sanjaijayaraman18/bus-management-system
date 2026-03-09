import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_URL = '/api/auth';

    private authState = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: HttpClient, private router: Router) { }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.AUTH_URL}/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.AUTH_URL}/login`, credentials).pipe(
            tap(response => {
                if (response.jwt) {
                    localStorage.setItem('token', response.jwt);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.authState.next(true);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authState.next(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getCurrentUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated(): Observable<boolean> {
        return this.authState.asObservable();
    }
}
