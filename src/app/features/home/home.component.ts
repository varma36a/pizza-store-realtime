import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <h1>Real-Time Pizza Store</h1>
      <p>Order fresh pizza and track every step — from oven to your door — live.</p>
      <div class="actions">
        <a mat-raised-button color="primary" routerLink="/menu">Browse Menu</a>
        @if (!auth.isAuthenticated()) {
          <a mat-stroked-button routerLink="/auth/login">Sign In</a>
        } @else {
          <a mat-stroked-button routerLink="/orders">Track Orders</a>
        }
      </div>
    </section>

    <section class="features">
      <h2>Angular Interview Topics Covered</h2>
      <div class="grid">
        @for (topic of topics; track topic.title) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ topic.title }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ topic.desc }}</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: `
    .hero {
      text-align: center;
      padding: 3rem 1rem;
      background: linear-gradient(135deg, #fff3e0, #ffe0b2);
      border-radius: 16px;
      margin-bottom: 2rem;
    }
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .features h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
    }
  `,
})
export class HomeComponent {
  readonly auth = inject(AuthService);

  readonly topics = [
    { title: 'Signals & Computed', desc: 'CartStore and OrderStore use signal-based reactive state.' },
    { title: 'Standalone Components', desc: 'All components are standalone — no NgModules.' },
    { title: 'New Control Flow', desc: '@if, @for, @switch replace *ngIf/*ngFor.' },
    { title: 'Lazy Loading', desc: 'Feature routes load on demand via loadComponent.' },
    { title: 'Route Guards', desc: 'authGuard, adminGuard, guestGuard protect routes.' },
    { title: 'Resolvers', desc: 'Pre-fetch menu data before route activation.' },
    { title: 'Reactive Forms', desc: 'Checkout and login use FormBuilder + validators.' },
    { title: 'HttpClient Interceptors', desc: 'Auth, loading, and error interceptors.' },
    { title: 'RxJS Real-Time', desc: 'WebSocket-style order updates via Subject + interval.' },
    { title: 'Custom Pipes & Directives', desc: 'pizzaCurrency, timeAgo, highlight, clickOutside.' },
    { title: 'OnPush Change Detection', desc: 'Performance optimization on all feature components.' },
    { title: 'Dependency Injection', desc: 'inject() function and providedIn root services.' },
  ];
}
