import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthManager } from '../../services/auth.manager';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../../meta/user.meta';

@Component({
  selector: 'app-login.modal.',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
  ],
  templateUrl: './login.modal..html',
  styleUrl: './login.modal..scss',
})
export class LoginModal {
  private authManager = inject(AuthManager);
  private dialogRef = inject(MatDialogRef<LoginModal>);
  private router = inject(Router);
  login() {
    if (this.signInForm.valid)
      this.authManager
        .login(this.signInForm.value)
        .subscribe((user: { email: User }) => {
          this.router.navigate([
            user.email.email === 'admin@admin.admin' ? '/admin' : '/profile',
          ]);
          this.dialogRef.close();
        });
  }
  signInForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
  });
}
