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
  template: `
    <div class="tracker">
      <div class="header">
        <h3>Order {{ order().id }}</h3>
        <span class="live-badge">● LIVE</span>
      </div>

      <mat-progress-bar
        mode="determinate"
        [value]="progress()"
        color="accent"
      ></mat-progress-bar>

      <p class="status-label">{{ statusLabel() }}</p>

      <div class="steps">
        @for (step of steps(); track step) {
          <div class="step" [class.active]="isStepActive(step)" [class.done]="isStepDone(step)">
            <mat-icon>{{ isStepDone(step) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
            <span>{{ labels[step] }}</span>
          </div>
        }
      </div>

      <ul class="history">
        @for (event of order().statusHistory.slice().reverse(); track event.timestamp) {
          <li>
            <strong>{{ labels[event.status] }}</strong> — {{ event.message }}
            <small>({{ event.timestamp | timeAgo }})</small>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .tracker {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 12px;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .live-badge {
      color: #e53935;
      font-size: 0.75rem;
      font-weight: 700;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .status-label {
      font-weight: 500;
      margin: 0.75rem 0;
    }
    .steps {
      display: grid;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #999;
    }
    .step.active {
      color: #e65100;
      font-weight: 600;
    }
    .step.done {
      color: #2e7d32;
    }
    .history {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.875rem;
      color: #555;
    }
    .history small {
      color: #999;
    }
  `,
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
