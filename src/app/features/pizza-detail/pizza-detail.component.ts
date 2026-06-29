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
  template: `
    @if (pizza()) {
      <div class="detail">
        <div class="visual">
          <span class="emoji">{{ pizza()!.imageUrl }}</span>
          <h1>{{ pizza()!.name }}</h1>
          <p>{{ pizza()!.description }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="addToCart()" class="form">
          <h2>Customize Your Pizza</h2>

          <label>Size</label>
          <mat-radio-group formControlName="size">
            @for (size of sizes; track size) {
              <mat-radio-button [value]="size">{{ size | titlecase }}</mat-radio-button>
            }
          </mat-radio-group>

          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity" min="1" max="10" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Extra Toppings</mat-label>
            <mat-select formControlName="extraToppings" multiple>
              @for (topping of extraToppings; track topping) {
                <mat-option [value]="topping">{{ topping | titlecase }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Special Instructions</mat-label>
            <textarea matInput formControlName="specialInstructions" rows="2"></textarea>
          </mat-form-field>

          <p class="price">Total: {{ livePrice() | pizzaCurrency }}</p>

          <div class="actions">
            <a mat-button routerLink="/menu">Back</a>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    } @else {
      <p>Pizza not found. <a routerLink="/menu">Back to menu</a></p>
    }
  `,
  styles: `
    .detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 768px) {
      .detail {
        grid-template-columns: 1fr;
      }
    }
    .emoji {
      font-size: 6rem;
      display: block;
      text-align: center;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      border: 1px solid #eee;
      border-radius: 12px;
    }
    mat-radio-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #e65100;
    }
    .actions {
      display: flex;
      justify-content: space-between;
    }
  `,
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
