import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
        take(1),
        map(isAuth => {
            if (isAuth) {
                return true;
            } else {
                router.navigate(['/login']);
                return false;
            }
        })
    );
};
