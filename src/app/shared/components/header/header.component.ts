import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartStore } from '../../../store/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-toolbar color="primary" class="header">
      <a routerLink="/" class="brand">
        <span class="logo">🍕</span>
        <span>Pizza Store</span>
      </a>

      <nav class="nav">
        <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Home
        </a>
        <a mat-button routerLink="/menu" routerLinkActive="active">Menu</a>
        <a mat-button routerLink="/orders" routerLinkActive="active">Orders</a>
        @if (auth.isAdmin()) {
          <a mat-button routerLink="/admin" routerLinkActive="active">Admin</a>
        }
      </nav>

      <span class="spacer"></span>

      <a mat-icon-button routerLink="/cart" aria-label="Cart">
        <mat-icon
          matBadge="{{ cart.itemCount() }}"
          matBadgeColor="accent"
          [matBadgeHidden]="cart.isEmpty()"
        >
          shopping_cart
        </mat-icon>
      </a>

      @if (auth.isAuthenticated()) {
        <span class="user">{{ auth.currentUser()?.name }}</span>
        <button mat-button (click)="auth.logout()">Logout</button>
      } @else {
        <a mat-button routerLink="/auth/login">Login</a>
      }
    </mat-toolbar>
  `,
  styles: `
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .logo {
      font-size: 1.5rem;
    }
    .nav {
      margin-left: 2rem;
      display: flex;
      gap: 0.25rem;
    }
    .spacer {
      flex: 1;
    }
    .user {
      margin-right: 0.5rem;
      font-size: 0.875rem;
    }
    .active {
      background: rgba(255, 255, 255, 0.15);
    }
  `,
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartStore);
}
