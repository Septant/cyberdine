import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';
import { AuthManager } from './auth.manager';
import { Notification } from '../meta/notification';
import { OrdersService } from './orders.service';
import { ActiveOrder } from '../meta/order.meta';
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private socket!: Socket;
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private reconnectInterval?: any;
  private authManager = inject(AuthManager);
  private ordersService = inject(OrdersService);
  orderUpdate$ = new Subject<void>();
  private activeOrder$ = new BehaviorSubject<ActiveOrder | null>(null);

  initConnection(): void {
    const email = this.authManager.getCurrentUserEmail();
    if (!email) return;

    this.ordersService.getLastOrder().subscribe({
      next: (order: ActiveOrder | null) => {
        this.activeOrder$.next(order);
        if (order?.notify) {
          this.connectSocket(email);
        }
      },
    });
  }

  // Сетап сокета
  private connectSocket(email: string): void {
    this.socket = io(environment.wsUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      query: {
        email: email,
      },
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected for user:', email);
    });

    this.socket.on('new_notification', (notification: Notification) => {
      console.log('new notification:', notification);

      this.notifications$.next([...this.notifications$.value, notification]);
      this.orderUpdate$.next();
      if (['отклонена', 'пропуск выдан'].includes(notification.message)) {
        this.disconnect();
        this.activeOrder$.next(null);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  setupNewOrder(order: ActiveOrder): void {
    this.activeOrder$.next(order);
    if (order.notify) {
      this.connectSocket(this.authManager.getCurrentUserEmail() as string);
    } else {
      this.ordersService
        .getLastOrder()
        .subscribe((order) => this.activeOrder$.next(order));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      clearInterval(this.reconnectInterval);
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getActiveOrder(): Observable<ActiveOrder | null> {
    return this.activeOrder$.asObservable();
  }

  markAllAsRead(): void {
    const email = this.authManager.getCurrentUserEmail();
    if (!email) return;

    // Отправляем запрос на бэкенд через API или WebSocket
    if (this.socket) {
      this.socket.emit('mark_notifications_read');
    }

    // Опционально: сразу обновляем локальное состояние
    this.notifications$.next([]);
  }
}
