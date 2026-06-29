import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { Order, ORDER_STATUS_LABELS } from '../../core/models/order.model';
import { OrderStore } from '../../store/order.store';
import { RealtimeService } from '../../core/services/realtime.service';
import { PizzaCurrencyPipe } from '../../shared/pipes/pizza-currency.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatChipsModule, PizzaCurrencyPipe, TimeAgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private readonly orderStore = inject(OrderStore);
  private readonly realtime = inject(RealtimeService);

  readonly orders = signal<Order[]>([]);
  readonly labels = ORDER_STATUS_LABELS;
  readonly columns = ['id', 'customer', 'items', 'status', 'total', 'updated'];

  statusLabel(status: Order['status']): string {
    return this.labels[status];
  }

  ngOnInit(): void {
    this.realtime.connect();
    this.refresh();

    this.realtime.updates$.subscribe(() => this.refresh());
  }

  private refresh(): void {
    this.orders.set(this.orderStore.pendingOrders());
  }
}
