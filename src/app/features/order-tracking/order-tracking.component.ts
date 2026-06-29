import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { RealtimeService } from '../../core/services/realtime.service';
import { OrderStore } from '../../store/order.store';
import { OrderStatusTrackerComponent } from '../../shared/components/order-status-tracker/order-status-tracker.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [OrderStatusTrackerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-tracking.component.html',
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderStore = inject(OrderStore);
  private readonly realtime = inject(RealtimeService);
  private sub?: { unsubscribe: () => void };

  readonly order = signal<Order | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.refreshOrder(id);
    this.realtime.subscribeToOrder(id);

    this.sub = this.realtime.updates$.subscribe((event) => {
      if (event.orderId === id) {
        this.refreshOrder(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.realtime.disconnect();
  }

  private refreshOrder(id: string): void {
    this.order.set(this.orderStore.getOrderById(id));
  }
}
