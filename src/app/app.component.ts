import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main class="container">
      <router-outlet />
    </main>
    <app-loading-spinner />
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }
  `,
})
export class AppComponent {}
