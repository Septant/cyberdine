import { inject, Injectable } from '@angular/core';
import { ActiveOrder, Order } from '../meta/order.meta';
import { HttpService } from './http.service';
import { ServerModule } from '../meta/http.meta';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private httpService = inject(HttpService);

  // Создание заявки
  createOrder(order: Order) {
    return this.httpService.serverPost<ActiveOrder>(
      ServerModule.orders,
      '',
      order
    );
  }

  // Админ-функция получения списка всех актуальных заявок
  getAllOrders() {
    return this.httpService.serverGet<ActiveOrder[]>(
      ServerModule.orders,
      'all'
    );
  }

  // Админ-функция обновления статуса заявления
  updateOrderStatus(id: number, status: string): Observable<ActiveOrder> {
    return this.httpService.serverPatch<ActiveOrder>(
      ServerModule.orders,
      `${id}/status`,
      { status }
    );
  }

  // Получение актуального статуса заявки
  getLastOrder(): Observable<ActiveOrder | null> {
    return this.httpService.serverGet<ActiveOrder | null>(
      ServerModule.orders,
      'last'
    );
  }
}
