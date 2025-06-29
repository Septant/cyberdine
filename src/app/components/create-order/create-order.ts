import { DatePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../meta/order.meta';
import { tap } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd.MM.YYYY',
  },
  display: {
    dateInput: 'dd.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'dd.MM.YYYY',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-create-order',
  imports: [
    MatCardModule,
    MatIcon,
    MatButton,
    MatIconButton,
    MatFormField,
    MatInputModule,
    MatDatepickerModule,
    MatLabel,
    ReactiveFormsModule,
    MatHint,
    MatError,
    MatCheckbox,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    provideNativeDateAdapter(),
    DatePipe,
    MatNativeDateModule,
  ],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
})
export class CreateOrder implements OnInit {
  private dialogRef = inject(MatDialogRef<CreateOrder>);
  private fb = inject(FormBuilder);
  ordersService = inject(OrdersService);
  notificationsService = inject(NotificationsService);
  form!: FormGroup;
  minDate: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fullName: string;
      organization: string;
      phone: string;
    }
  ) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: [
        { value: this.data.fullName, disabled: false },
        Validators.required,
      ],
      organization: [
        { value: this.data.organization, disabled: false },
        Validators.required,
      ],
      phone: [{ value: this.data.phone, disabled: false }, Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      expirationDate: [null, [Validators.required, this.futureDateValidator]],
      notify: [false],
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data: Order = this.form.value;
      data.expirationDate = this.formatDate(data.expirationDate);
      this.ordersService
        .createOrder(data)
        .pipe(
          tap((order) => {
            this.notificationsService.setupNewOrder(order);
          })
        )
        .subscribe(() => this.dialogRef.close());
    }
  }

  closeModal() {
    this.dialogRef.close(null);
  }

  get reasonCharacterCount(): number {
    return this.form.get('reason')?.value?.length || 0;
  }

  private formatDate(date: Date | string): string {
    const day = String((date as Date).getDate()).padStart(2, '0');
    const month = String((date as Date).getMonth() + 1).padStart(2, '0');
    const year = (date as Date).getFullYear();
    return `${day}.${month}.${year}`;
  }
}
