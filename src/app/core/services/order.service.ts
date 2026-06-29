import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of, tap } from 'rxjs';
import { CartStore } from '../../store/cart.store';
import { OrderStore } from '../../store/order.store';
import { AuthService } from './auth.service';
import {
  DeliveryAddress,
  ORDER_STATUS_FLOW,
  Order,
  OrderStatusEvent,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cartStore = inject(CartStore);
  private readonly orderStore = inject(OrderStore);
  private readonly authService = inject(AuthService);

  placeOrder(address: DeliveryAddress): Observable<Order> {
    const items = this.cartStore.items();
    const summary = this.cartStore.summary();
    const user = this.authService.currentUser();

    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id ?? 'guest',
      items: [...items],
      subtotal: summary.subtotal,
      tax: summary.tax,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      status: 'pending',
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          orderId: `ORD-${Date.now()}`,
          status: 'pending',
          message: 'Order received — waiting for confirmation',
          timestamp: new Date(),
        },
      ],
    };

    order.statusHistory[0].orderId = order.id;

    return of(order).pipe(
      delay(800),
      tap((o) => {
        this.orderStore.addOrder(o);
        this.cartStore.clear();
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return of(this.orderStore.orders()).pipe(delay(200));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.orderStore.getOrderById(id)).pipe(delay(200));
  }

  getStatusProgress(status: Order['status']): number {
    const index = ORDER_STATUS_FLOW.indexOf(status);
    return index >= 0 ? ((index + 1) / ORDER_STATUS_FLOW.length) * 100 : 0;
  }

  getNextStatus(current: Order['status']): Order['status'] | null {
    const index = ORDER_STATUS_FLOW.indexOf(current);
    if (index < 0 || index >= ORDER_STATUS_FLOW.length - 1) return null;
    return ORDER_STATUS_FLOW[index + 1];
  }

  getStatusMessage(status: Order['status']): string {
    const messages: Record<Order['status'], string> = {
      pending: 'Your order has been received',
      confirmed: 'Kitchen confirmed your order',
      preparing: 'Chefs are prepping your ingredients',
      baking: 'Your pizza is in the oven 🔥',
      out_for_delivery: 'Driver is on the way!',
      delivered: 'Enjoy your pizza!',
      cancelled: 'Order was cancelled',
    };
    return messages[status];
  }
}
