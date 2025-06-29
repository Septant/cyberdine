export interface Order {
  fullName: string;
  organization: string;
  phone: string;
  reason: string;
  expirationDate: Date | string;
  notify: boolean;
}
export type OrderStatus =
  | 'в обработке'
  | 'на согласовании'
  | 'пропуск готов'
  | 'отклонена'
  | 'пропуск выдан';

export interface ActiveOrder extends Order {
  id: number;
  userEmail: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
