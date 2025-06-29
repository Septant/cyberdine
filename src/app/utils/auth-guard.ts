import { CanActivateFn, Router } from '@angular/router';
import { AuthManager } from '../services/auth.manager';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../dialogs/alert/alert';

export const authGuard: CanActivateFn = (route, state) => {
  const authManager = inject(AuthManager);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (!authManager.getCurrentUserEmail()) {
    dialog.open(Alert, {
      width: '500px',
      height: '200px',
      data: {
        title: 'Внимание!',
        message: 'Вы не авторизованы.',
      },
    });
    return router.createUrlTree(['/']);
  }
  return true;
};
