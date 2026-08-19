import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      // Get the ProblemDetails message
      const detailMessage =
        err.error?.detail ??
        'A system error occurred. Please try again.';

      if (err.status === 401) {

        // Session expired / user not logged in
        router.navigate(['/login']);

      } else {

        // Log the useful error message
        console.error(
          'API Error Response:',
          detailMessage
        );
      }

      return throwError(() => err);
    })
  );
};
