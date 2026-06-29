import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, Subscription, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderStatus, OrderStatusEvent } from '../models/order.model';
import { OrderService } from './order.service';
import { OrderStore } from '../../store/order.store';

/**
 * Simulates a real-time WebSocket connection for live order tracking.
 * Uses RxJS Subject + interval to push status updates — interview talking point
 * for WebSocketSubject, SSE, or SignalR alternatives.
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private readonly orderStore = inject(OrderStore);
  private readonly orderService = inject(OrderService);

  private readonly statusUpdates$ = new Subject<OrderStatusEvent>();
  private simulationSub?: Subscription;

  /** Observable stream of live order status events (WebSocket pattern) */
  readonly updates$ = this.statusUpdates$.asObservable();

  connect(): void {
    if (this.simulationSub) return;

    this.simulationSub = interval(environment.orderUpdateIntervalMs).subscribe(() => {
      this.advanceActiveOrders();
    });
  }

  disconnect(): void {
    this.simulationSub?.unsubscribe();
    this.simulationSub = undefined;
  }

  subscribeToOrder(orderId: string): void {
    this.orderStore.setActiveOrder(orderId);
    this.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.statusUpdates$.complete();
  }

  private advanceActiveOrders(): void {
    const pending = this.orderStore.pendingOrders();

    for (const order of pending) {
      const nextStatus = this.orderService.getNextStatus(order.status);
      if (!nextStatus || nextStatus === 'pending') {
        if (order.status === 'pending') {
          this.emitUpdate(order.id, 'confirmed');
        }
        continue;
      }

      if (order.status === 'pending') continue;

      this.emitUpdate(order.id, nextStatus);
    }
  }

  private emitUpdate(orderId: string, status: OrderStatus): void {
    const message = this.orderService.getStatusMessage(status);
    this.orderStore.updateOrderStatus(orderId, status, message);

    this.statusUpdates$.next({
      orderId,
      status,
      message,
      timestamp: new Date(),
      estimatedMinutes: status === 'out_for_delivery' ? 12 : undefined,
    });
  }
}
