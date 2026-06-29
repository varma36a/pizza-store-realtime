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
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
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
