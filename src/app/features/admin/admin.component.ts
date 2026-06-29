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
  template: `
    <h1>Admin Dashboard</h1>
    <p class="subtitle">Real-time kitchen view — all active orders</p>

    <table mat-table [dataSource]="orders()" class="admin-table">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Order</th>
        <td mat-cell *matCellDef="let order">{{ order.id }}</td>
      </ng-container>

      <ng-container matColumnDef="customer">
        <th mat-header-cell *matHeaderCellDef>Customer</th>
        <td mat-cell *matCellDef="let order">{{ order.userId }}</td>
      </ng-container>

      <ng-container matColumnDef="items">
        <th mat-header-cell *matHeaderCellDef>Items</th>
        <td mat-cell *matCellDef="let order">{{ order.items.length }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let order">
          <mat-chip [class]="order.status">{{ statusLabel(order.status) }}</mat-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="total">
        <th mat-header-cell *matHeaderCellDef>Total</th>
        <td mat-cell *matCellDef="let order">{{ order.total | pizzaCurrency }}</td>
      </ng-container>

      <ng-container matColumnDef="updated">
        <th mat-header-cell *matHeaderCellDef>Updated</th>
        <td mat-cell *matCellDef="let order">{{ order.updatedAt | timeAgo }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>

    @if (orders().length === 0) {
      <p class="empty">No active orders in the kitchen.</p>
    }
  `,
  styles: `
    .subtitle {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .admin-table {
      width: 100%;
    }
    .empty {
      text-align: center;
      padding: 2rem;
      color: #888;
    }
    .preparing { background: #fff3e0 !important; }
    .baking { background: #ffccbc !important; }
    .out_for_delivery { background: #c8e6c9 !important; }
  `,
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
