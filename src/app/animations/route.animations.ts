import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(16px) scale(0.98)' }),
      animate(
        '450ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        style({ opacity: 1, transform: 'translateY(0) scale(1)' })
      ),
    ], { optional: true }),
  ]),
]);
