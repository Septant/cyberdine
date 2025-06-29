import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthManager } from '../../services/auth.manager';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { CreateOrder } from '../../components/create-order/create-order';
import { AppManager } from '../../services/app.manager';
import { User } from '../../meta/user.meta';
import { OrdersService } from '../../services/orders.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, Observable, Subject, tap } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { ActiveOrder } from '../../meta/order.meta';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-page',
  imports: [MatButton, DatePipe, AsyncPipe, MatIcon],
  providers: [DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit, OnDestroy {
  private appManager = inject(AppManager);
  public ordersService = inject(OrdersService);
  private notificationsService = inject(NotificationsService);
  private _cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);

  lastOrder$!: Observable<ActiveOrder | null>;
  canCreateNewOrder$!: Observable<boolean>;

  ngOnInit(): void {
    this.notificationsService.initConnection();
    this.lastOrder$ = this.notificationsService.getActiveOrder();

    this.canCreateNewOrder$ = this.lastOrder$.pipe(
      map(
        (order) =>
          !order || ['отклонена', 'пропуск выдан'].includes(order.status)
      )
    );
    this.notificationsService.orderUpdate$
      .pipe(
        tap(() => {
          this.lastOrder$ = this.ordersService.getLastOrder();
          this._cdr.markForCheck();
        })
      )
      .subscribe();
  }
  createOrder() {
    const userData: Omit<User, 'email'> = {
      fullName: this.appManager.user.value!.fullName,
      organization: this.appManager.user.value!.organization,
      phone: this.appManager.user.value!.phone,
    };
    this.dialog
      .open(CreateOrder, {
        width: '1200px',
        height: '900px',
        data: userData,
      })
      .afterClosed()
      .subscribe();
  }

  updateStatus() {
    this.lastOrder$ = this.ordersService.getLastOrder();
  }

  ngOnDestroy(): void {
    this.notificationsService.disconnect();
  }
}
