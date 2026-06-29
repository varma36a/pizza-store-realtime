import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pizzaCurrency', standalone: true })
export class PizzaCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, showCents = true): string {
    if (value == null || isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    }).format(value);
  }
}
