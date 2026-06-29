import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { Order, ORDER_STATUS_LABELS } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { OrderStore } from '../../store/order.store';
import { PizzaCurrencyPipe } from '../../shared/pipes/pizza-currency.pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    RouterLink,
    PizzaCurrencyPipe,
    TimeAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly orderStore = inject(OrderStore);

  readonly orders = signal<Order[]>([]);
  readonly labels = ORDER_STATUS_LABELS;
  readonly columns = ['id', 'status', 'total', 'created', 'actions'];

  statusLabel(status: Order['status']): string {
    return this.labels[status];
  }

  ngOnInit(): void {
    this.orders.set(this.orderStore.orders());
    this.orderService.getOrders().subscribe((orders) => this.orders.set(orders));
  }
}
