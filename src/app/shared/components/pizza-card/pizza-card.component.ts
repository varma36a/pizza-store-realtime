import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Pizza } from '../../../core/models/pizza.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { PizzaCurrencyPipe } from '../../pipes/pizza-currency.pipe';

@Component({
  selector: 'app-pizza-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RouterLink,
    PizzaCurrencyPipe,
    HighlightDirective,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="pizza-card" appHighlight>
      <div class="emoji">{{ pizza().imageUrl }}</div>
      <mat-card-header>
        <mat-card-title>{{ pizza().name }}</mat-card-title>
        <mat-card-subtitle>{{ pizza().category | titlecase }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>{{ pizza().description }}</p>
        <div class="meta">
          <span><mat-icon>star</mat-icon> {{ pizza().rating }}</span>
          <span><mat-icon>schedule</mat-icon> {{ pizza().prepTimeMinutes }} min</span>
          @if (pizza().isVegetarian) {
            <mat-chip>Veg</mat-chip>
          }
          @if (pizza().isSpicy) {
            <mat-chip color="warn">Spicy</mat-chip>
          }
        </div>
        <p class="price">{{ pizza().basePrice | pizzaCurrency }}+</p>
      </mat-card-content>
      <mat-card-actions>
        <a mat-button [routerLink]="['/menu', pizza().id]">Customize</a>
        <button mat-raised-button color="primary" (click)="quickAdd.emit(pizza())">
          Quick Add
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .pizza-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s;
    }
    .pizza-card:hover {
      transform: translateY(-4px);
    }
    .emoji {
      font-size: 4rem;
      text-align: center;
      padding: 1rem 0 0;
    }
    .meta {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #666;
    }
    .meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
    .price {
      font-size: 1.25rem;
      font-weight: 600;
      color: #e65100;
    }
    mat-card-actions {
      margin-top: auto;
      justify-content: space-between;
    }
  `,
})
export class PizzaCardComponent {
  readonly pizza = input.required<Pizza>();
  readonly quickAdd = output<Pizza>();
}
