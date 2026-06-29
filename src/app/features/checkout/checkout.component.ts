import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartStore } from '../../store/cart.store';
import { OrderService } from '../../core/services/order.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { PizzaCurrencyPipe } from '../../shared/pipes/pizza-currency.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PizzaCurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Checkout</h1>

    <div class="layout">
      <form [formGroup]="form" (ngSubmit)="placeOrder()" class="form">
        <h2>Delivery Details</h2>

        <mat-form-field appearance="outline">
          <mat-label>Street Address</mat-label>
          <input matInput formControlName="street" />
          @if (form.controls.street.hasError('required') && form.controls.street.touched) {
            <mat-error>Street is required</mat-error>
          }
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>ZIP Code</mat-label>
            <input matInput formControlName="zipCode" />
            @if (form.controls.zipCode.hasError('pattern')) {
              <mat-error>Enter a valid 5-digit ZIP</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting()">
          @if (submitting()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Place Order — {{ cart.summary().total | pizzaCurrency }}
          }
        </button>
      </form>

      <aside class="summary">
        <h3>Order Summary</h3>
        @for (item of cart.items(); track item.id) {
          <div class="item">
            <span>{{ item.pizza.name }} × {{ item.customization.quantity }}</span>
            <span>{{ item.lineTotal | pizzaCurrency }}</span>
          </div>
        }
        <div class="total">Total: {{ cart.summary().total | pizzaCurrency }}</div>
      </aside>
    </div>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 768px) {
      .layout { grid-template-columns: 1fr; }
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .summary {
      padding: 1.5rem;
      border: 1px solid #eee;
      border-radius: 12px;
      height: fit-content;
    }
    .item {
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }
    .total {
      font-weight: 700;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid #eee;
    }
  `,
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  readonly cart = inject(CartStore);
  private readonly orderService = inject(OrderService);
  private readonly realtime = inject(RealtimeService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });

  placeOrder(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    const address = this.form.getRawValue();

    this.orderService.placeOrder(address).subscribe({
      next: (order) => {
        this.realtime.subscribeToOrder(order.id);
        this.router.navigate(['/orders', order.id, 'track']);
      },
      complete: () => this.submitting.set(false),
      error: () => this.submitting.set(false),
    });
  }
}
