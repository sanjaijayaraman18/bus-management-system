import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly LOGIN_URL = '/login';
    private readonly LOGOUT_URL = '/logout';

    private authState = new BehaviorSubject<boolean>(this.hasSession());

    constructor(private http: HttpClient, private router: Router) { }

    private hasSession(): boolean {
        return !!localStorage.getItem('is_logged_in');
    }

    login(credentials: { username: string; password: string }): Observable<any> {
        // Explicitly format as URL-encoded for Spring Security formLogin
        const body = new HttpParams()
            .set('username', credentials.username)
            .set('password', credentials.password);

        return this.http.post(this.LOGIN_URL, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        }).pipe(
            tap(() => {
                localStorage.setItem('is_logged_in', 'true');
                this.authState.next(true);
            })
        );
    }

    logout(): void {
        this.http.post(this.LOGOUT_URL, {}, { withCredentials: true }).pipe(
            catchError(() => of(null)),
            tap(() => this.clearStorage())
        ).subscribe();
    }

    private clearStorage(): void {
        localStorage.removeItem('is_logged_in');
        this.authState.next(false);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): Observable<boolean> {
        return this.authState.asObservable();
    }
}
