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
  template: `
    <h1>Your Orders</h1>

    @if (orders().length === 0) {
      <p class="empty">No orders yet. <a routerLink="/menu">Order a pizza!</a></p>
    } @else {
      <table mat-table [dataSource]="orders()" class="orders-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Order ID</th>
          <td mat-cell *matCellDef="let order">{{ order.id }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let order">
            <mat-chip>{{ statusLabel(order.status) }}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let order">{{ order.total | pizzaCurrency }}</td>
        </ng-container>

        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Placed</th>
          <td mat-cell *matCellDef="let order">{{ order.createdAt | timeAgo }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let order">
            <a mat-button [routerLink]="['/orders', order.id, 'track']">Track Live</a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    }
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 2rem;
      color: #888;
    }
    .orders-table {
      width: 100%;
    }
  `,
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
