import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CartStore } from '../../store/cart.store';
import { PizzaCurrencyPipe } from '../../shared/pipes/pizza-currency.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatListModule, MatButtonModule, MatIconModule, RouterLink, PizzaCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Your Cart</h1>

    @if (cart.isEmpty()) {
      <div class="empty">
        <mat-icon>shopping_cart</mat-icon>
        <p>Your cart is empty</p>
        <a mat-raised-button color="primary" routerLink="/menu">Browse Menu</a>
      </div>
    } @else {
      <mat-list>
        @for (item of cart.items(); track item.id) {
          <mat-list-item class="cart-item">
            <span matListItemTitle>{{ item.pizza.name }} ({{ item.customization.size }})</span>
            <span matListItemLine>Qty: {{ item.customization.quantity }}</span>
            <span matListItemMeta>{{ item.lineTotal | pizzaCurrency }}</span>
            <button mat-icon-button (click)="cart.updateQuantity(item.id, item.customization.quantity - 1)">
              <mat-icon>remove</mat-icon>
            </button>
            <button mat-icon-button (click)="cart.updateQuantity(item.id, item.customization.quantity + 1)">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="cart.removeItem(item.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        }
      </mat-list>

      <div class="summary">
        <div class="row"><span>Subtotal</span><span>{{ cart.summary().subtotal | pizzaCurrency }}</span></div>
        <div class="row"><span>Tax</span><span>{{ cart.summary().tax | pizzaCurrency }}</span></div>
        <div class="row"><span>Delivery</span><span>{{ cart.summary().deliveryFee | pizzaCurrency }}</span></div>
        <div class="row total"><span>Total</span><span>{{ cart.summary().total | pizzaCurrency }}</span></div>
        <a mat-raised-button color="primary" routerLink="/checkout">Proceed to Checkout</a>
      </div>
    }
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 3rem;
      color: #888;
    }
    .empty mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
    }
    .cart-item {
      border-bottom: 1px solid #eee;
    }
    .summary {
      max-width: 400px;
      margin-left: auto;
      margin-top: 2rem;
      padding: 1.5rem;
      border: 1px solid #eee;
      border-radius: 12px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .total {
      font-weight: 700;
      font-size: 1.25rem;
      border-top: 1px solid #eee;
      padding-top: 0.75rem;
      margin: 0.75rem 0 1rem;
    }
  `,
})
export class CartComponent {
  readonly cart = inject(CartStore);
}
