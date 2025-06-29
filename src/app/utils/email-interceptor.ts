import { HttpInterceptorFn } from '@angular/common/http';
import { AuthManager } from '../services/auth.manager';
import { inject } from '@angular/core';

export const emailInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthManager);
  const email = authService.getCurrentUserEmail();

  if (email) {
    const authReq = req.clone({
      setHeaders: {
        'X-User-Email': email,
      },
    });
    return next(authReq);
  }

  return next(req);
};
