import { Routes } from '@angular/router';
import { authGuard } from './utils/auth-guard';
import { AdminPage } from './pages/admin-page/admin-page';
import { adminGuard } from './utils/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/main-page/main-page').then((mod) => mod.MainPage),
  },
  {
    path: 'profile',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile-page/profile-page').then(
        (mod) => mod.ProfilePage
      ),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-page/admin-page').then((mod) => mod.AdminPage),
  },
];
