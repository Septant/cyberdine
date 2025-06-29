import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { OrdersService } from '../../services/orders.service';
import { OrderStatus } from '../../meta/order.meta';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, startWith, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    AsyncPipe,
  ],
  providers: [DatePipe],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage implements OnInit {
  displayedColumns: string[] = [
    'id',
    'userEmail',
    'fullName',
    'organization',
    'status',
    'createdAt',
    'actions',
  ];
  updatingStatusId: number | null = null;
  private orderService = inject(OrdersService);
  orders$!: Observable<any[]>;
  private refreshTrigger = new BehaviorSubject<null>(null);

  ngOnInit(): void {
    this.orders$ = this.refreshTrigger.pipe(
      startWith(null),
      switchMap(() =>
        timer(0, 60000).pipe(switchMap(() => this.orderService.getAllOrders()))
      )
    );
  }

  updateStatus(orderId: number, newStatus: OrderStatus): void {
    this.updatingStatusId = orderId;
    // Задержка 5 секунд перед обновлением

    this.orderService
      .updateOrderStatus(orderId, newStatus)
      .subscribe(() => this.refreshTrigger.next(null));
  }

  getAvailableStatuses(currentStatus: OrderStatus): OrderStatus[] {
    switch (currentStatus) {
      case 'в обработке':
        return ['на согласовании', 'отклонена'];
      case 'на согласовании':
        return ['пропуск готов', 'отклонена'];
      case 'пропуск готов':
        return ['пропуск выдан'];
      default:
        return [];
    }
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'в обработке':
        return 'status-processing';
      case 'на согласовании':
        return 'status-approval';
      case 'пропуск готов':
        return 'status-ready';
      case 'отклонена':
        return 'status-rejected';
      case 'пропуск выдан':
        return 'status-completed';
      default:
        return '';
    }
  }
}
