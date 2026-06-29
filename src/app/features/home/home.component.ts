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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
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
