import { computed, inject, Injectable } from '@angular/core';
import { User } from '../meta/user.meta';
import { HttpService } from './http.service';
import { ServerModule } from '../meta/http.meta';
import { AppManager } from './app.manager';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  private readonly ADMIN_EMAIL = 'admin@admin.admin';
  private readonly SESSION_KEY = 'current_user_email';
  private httpService = inject(HttpService);
  private appManager = inject(AppManager);
  isAdmin = computed(() => this.getCurrentUserEmail() === this.ADMIN_EMAIL);
  getCurrentUserEmail() {
    return sessionStorage.getItem(this.SESSION_KEY);
  }

  signUp(userData: User) {
    return this.httpService
      .serverPost<User>(ServerModule.users, '', userData)
      .pipe(
        filter((user) => !!user),
        tap((user: User) => {
          this.appManager.isAuthorized.set(!!user);
          this.appManager.user.next(user);
          sessionStorage.setItem(this.SESSION_KEY, user.email);
        })
      );
  }

  // @BUG: на бэке отправляемый результат логируется как тип User. На фронт приходит {email: }
  login(data: { email: string }) {
    return this.httpService
      .serverPost<{ email: User }>(ServerModule.auth, 'login', data)
      .pipe(
        filter((user: { email: User }) => !!user),
        tap((user: { email: User }) => {
          this.appManager.isAuthorized.set(!!user);
          this.appManager.user.next(user.email);
          sessionStorage.setItem(this.SESSION_KEY, data.email);
        })
      );
  }

  logout() {
    return this.httpService.serverDelete(ServerModule.auth, 'logout').pipe(
      tap(() => {
        sessionStorage.removeItem(this.SESSION_KEY);
        this.appManager.user.next(null);
        this.appManager.isAuthorized.set(false);
      })
    );
  }
}
