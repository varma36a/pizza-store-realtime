import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AVAILABLE_EXTRA_TOPPINGS } from '../../core/data/mock-pizzas';
import {
  calculatePizzaPrice,
  Pizza,
  PizzaCustomization,
  PizzaSize,
} from '../../core/models/pizza.model';
import { CartStore } from '../../store/cart.store';
import { PizzaCurrencyPipe } from '../../shared/pipes/pizza-currency.pipe';

@Component({
  selector: 'app-pizza-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
    PizzaCurrencyPipe,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pizza-detail.component.html',
  styleUrl: './pizza-detail.component.scss',
})
export class PizzaDetailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartStore = inject(CartStore);
  private readonly snackBar = inject(MatSnackBar);

  readonly pizza = signal<Pizza | undefined>(
    this.route.snapshot.data['pizza'] as Pizza | undefined
  );
  readonly extraToppings = AVAILABLE_EXTRA_TOPPINGS;
  readonly sizes: PizzaSize[] = ['small', 'medium', 'large'];

  readonly form = this.fb.nonNullable.group({
    size: ['medium' as PizzaSize, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    extraToppings: [[] as string[]],
    specialInstructions: [''],
  });

  private readonly formValues = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() }
  );

  livePrice(): number {
    const p = this.pizza();
    if (!p) return 0;
    const val = this.formValues()!;
    const customization: PizzaCustomization = {
      size: val.size ?? 'medium',
      quantity: val.quantity ?? 1,
      extraToppings: val.extraToppings ?? [],
      removeToppings: [],
      specialInstructions: val.specialInstructions,
    };
    return calculatePizzaPrice(p, customization);
  }

  addToCart(): void {
    const p = this.pizza();
    if (!p || this.form.invalid) return;

    const val = this.form.getRawValue();
    this.cartStore.addItem(p, {
      size: val.size,
      quantity: val.quantity,
      extraToppings: val.extraToppings,
      removeToppings: [],
      specialInstructions: val.specialInstructions,
    });

    this.snackBar.open(`${p.name} added!`, 'View Cart', { duration: 3000 }).onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }
}
