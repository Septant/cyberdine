export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  orderId: number;
  userId: number;
}
