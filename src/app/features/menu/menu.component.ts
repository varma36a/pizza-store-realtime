import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pizza, PizzaCategory, PizzaCustomization } from '../../core/models/pizza.model';
import { CartStore } from '../../store/cart.store';
import { MenuService } from '../../core/services/menu.service';
import { PizzaCardComponent } from '../../shared/components/pizza-card/pizza-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    PizzaCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="menu-header">
      <h1>Our Menu</h1>
      <p>{{ pizzas().length }} pizzas available</p>
    </div>

    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Search pizzas</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Margherita, spicy..." />
      </mat-form-field>

      <mat-button-toggle-group [value]="category()" (change)="category.set($event.value)">
        @for (cat of categories; track cat.value) {
          <mat-button-toggle [value]="cat.value">{{ cat.label }}</mat-button-toggle>
        }
      </mat-button-toggle-group>

      <mat-slide-toggle [checked]="vegetarianOnly()" (change)="vegetarianOnly.set($event.checked)">
        Vegetarian only
      </mat-slide-toggle>
    </div>

    <div class="grid">
      @for (pizza of pizzas(); track pizza.id) {
        <app-pizza-card [pizza]="pizza" (quickAdd)="onQuickAdd($event)" />
      } @empty {
        <p class="empty">No pizzas match your filters.</p>
      }
    </div>
  `,
  styles: `
    .menu-header {
      margin-bottom: 1.5rem;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
    }
    .filters mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .empty {
      grid-column: 1 / -1;
      text-align: center;
      color: #888;
    }
  `,
})
export class MenuComponent {
  private readonly menuService = inject(MenuService);
  private readonly cartStore = inject(CartStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly category = signal<PizzaCategory | 'all'>('all');
  readonly vegetarianOnly = signal(false);
  readonly pizzas = signal<Pizza[]>([]);

  readonly categories = [
    { value: 'all' as const, label: 'All' },
    { value: 'classic' as const, label: 'Classic' },
    { value: 'premium' as const, label: 'Premium' },
    { value: 'veggie' as const, label: 'Veggie' },
    { value: 'specialty' as const, label: 'Specialty' },
  ];

  constructor() {
    const resolved = this.route.snapshot.data['menu'] as Pizza[] | undefined;
    if (resolved) {
      this.pizzas.set(resolved);
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) =>
          this.menuService.search({
            search,
            category: this.category(),
            vegetarianOnly: this.vegetarianOnly(),
          })
        ),
        takeUntilDestroyed()
      )
      .subscribe((pizzas) => this.pizzas.set(pizzas));
  }

  onQuickAdd(pizza: Pizza): void {
    const customization: PizzaCustomization = {
      size: 'medium',
      extraToppings: [],
      removeToppings: [],
      quantity: 1,
    };
    this.cartStore.addItem(pizza, customization);
    this.snackBar.open(`${pizza.name} added to cart!`, 'OK', { duration: 2000 });
  }
}
