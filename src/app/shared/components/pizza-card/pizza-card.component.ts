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
  templateUrl: './pizza-card.component.html',
  styleUrl: './pizza-card.component.scss',
})
export class PizzaCardComponent {
  readonly pizza = input.required<Pizza>();
  readonly quickAdd = output<Pizza>();
}
