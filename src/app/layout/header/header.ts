import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { SignupModal } from '../../dialogs/signup.modal/signup.modal';
import { AppManager } from '../../services/app.manager';
import { LoginModal } from '../../dialogs/login.modal/login.modal.';
import { AuthManager } from '../../services/auth.manager';
import { Router } from '@angular/router';
import { Notifications } from '../../components/notifications/notifications';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, Notifications],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private dialog = inject(MatDialog);
  appManager = inject(AppManager);
  private authManager = inject(AuthManager);
  private router = inject(Router);

  logout() {
    this.authManager.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  openSignUpModal() {
    this.dialog
      .open(SignupModal, { width: '500px', height: '700px' })
      .afterClosed()
      .subscribe();
  }

  openLoginModal() {
    this.dialog
      .open(LoginModal, { width: '500px', height: '400px' })
      .afterClosed()
      .subscribe();
  }
}
