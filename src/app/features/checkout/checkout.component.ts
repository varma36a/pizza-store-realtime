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
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
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
