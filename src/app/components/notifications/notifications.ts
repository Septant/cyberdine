import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationsService } from '../../services/notifications.service';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { Notification } from '../../meta/notification';
import { AsyncPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-notifications',
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDivider,
    MatList,
    MatListItem,
    DatePipe,
    AsyncPipe,
  ],
  providers: [DatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe();
  }
  notifications: Notification[] = [];
  unreadCount = 0;
  notificationsService = inject(NotificationsService);

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
    this.unreadCount = 0;
  }
}
