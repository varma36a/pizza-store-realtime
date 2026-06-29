import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  Order,
} from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-order-status-tracker',
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule, TimeAgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-status-tracker.component.html',
  styleUrl: './order-status-tracker.component.scss',
})
export class OrderStatusTrackerComponent {
  readonly order = input.required<Order>();
  readonly labels = ORDER_STATUS_LABELS;

  readonly progress = computed(() =>
    this.orderService.getStatusProgress(this.order().status)
  );

  readonly statusLabel = computed(() =>
    this.orderService.getStatusMessage(this.order().status)
  );

  readonly steps = computed(() => ORDER_STATUS_FLOW.filter((s) => s !== 'pending'));

  constructor(private readonly orderService: OrderService) {}

  isStepActive(step: Order['status']): boolean {
    return this.order().status === step;
  }

  isStepDone(step: Order['status']): boolean {
    const current = ORDER_STATUS_FLOW.indexOf(this.order().status);
    const stepIndex = ORDER_STATUS_FLOW.indexOf(step);
    return stepIndex < current;
  }
}
