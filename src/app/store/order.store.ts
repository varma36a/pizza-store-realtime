import { computed, Injectable, signal } from '@angular/core';
import { Order, OrderStatus } from '../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderStore {
  private readonly _orders = signal<Order[]>([]);
  private readonly _activeOrderId = signal<string | null>(null);

  readonly orders = this._orders.asReadonly();
  readonly activeOrderId = this._activeOrderId.asReadonly();

  readonly activeOrder = computed(() => {
    const id = this._activeOrderId();
    return id ? this._orders().find((o) => o.id === id) ?? null : null;
  });

  readonly pendingOrders = computed(() =>
    this._orders().filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
  );

  addOrder(order: Order): void {
    this._orders.update((orders) => [order, ...orders]);
    this._activeOrderId.set(order.id);
  }

  updateOrderStatus(orderId: string, status: OrderStatus, message: string): void {
    this._orders.update((orders) =>
      orders.map((order) => {
        if (order.id !== orderId) return order;
        const event = {
          orderId,
          status,
          message,
          timestamp: new Date(),
        };
        return {
          ...order,
          status,
          updatedAt: new Date(),
          statusHistory: [...order.statusHistory, event],
        };
      })
    );
  }

  setActiveOrder(orderId: string | null): void {
    this._activeOrderId.set(orderId);
  }

  getOrderById(id: string): Order | undefined {
    return this._orders().find((o) => o.id === id);
  }
}
