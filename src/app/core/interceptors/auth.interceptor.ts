import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<any> => {
  const authService: AuthService = inject(AuthService);

  const token: string | null = authService.getToken();

  const snackBar: MatSnackBar = inject(MatSnackBar);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 200) {
        const { error } = err;

        snackBar.open(error.msg, 'Cerrar', {
          duration: 3000,
        });

        authService.logout();
      }
      return of(err);
    })
  );
};
