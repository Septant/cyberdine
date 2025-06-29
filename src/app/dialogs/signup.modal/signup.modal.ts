import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { phoneNumberValidator } from '../../utils/phone.validator';
import { AuthManager } from '../../services/auth.manager';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signup.modal',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './signup.modal.html',
  styleUrl: './signup.modal.scss',
})
export class SignupModal {
  private authManager = inject(AuthManager);
  private dialogRef = inject(MatDialogRef<SignupModal>);
  signUpForm: FormGroup = new FormGroup({
    fullName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    phone: new FormControl<string>('', [
      Validators.required,
      phoneNumberValidator(),
    ]),
    organization: new FormControl<string>('', [Validators.required]),
  });

  signUp() {
    if (this.signUpForm.valid)
      this.authManager.signUp(this.signUpForm.value).subscribe(() => {
        this.dialogRef.close('success');
      });
  }
}
