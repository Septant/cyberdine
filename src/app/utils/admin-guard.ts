import { CanActivateFn, Router } from '@angular/router';
import { AuthManager } from '../services/auth.manager';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthManager);
  const router = inject(Router);
  return auth.isAdmin() || router.createUrlTree(['/profile']);
};
