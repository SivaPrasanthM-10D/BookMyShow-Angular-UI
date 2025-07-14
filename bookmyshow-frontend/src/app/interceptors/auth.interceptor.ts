import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            const snack = this.snackBar.open('Session timed out. Login again', 'Close', {
              duration: 5000,
              panelClass: 'session-expired-snackbar'
            });
            snack.afterDismissed().subscribe(() => {
              this.router.navigate(['/']);
            });
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const snack = this.snackBar.open('Session timed out. Login again', 'Close', {
            duration: 5000,
            panelClass: 'session-expired-snackbar'
          });
          snack.afterDismissed().subscribe(() => {
            this.router.navigate(['/']);
          });
        }
        return throwError(() => error);
      })
    );
  }
}