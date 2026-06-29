import { computed, Injectable, signal } from '@angular/core';
import {
  CartItem,
  CartSummary,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
} from '../core/models/cart.model';
import {
  calculatePizzaPrice,
  Pizza,
  PizzaCustomization,
} from '../core/models/pizza.model';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.customization.quantity, 0)
  );
  readonly isEmpty = computed(() => this._items().length === 0);

  readonly summary = computed((): CartSummary => {
    const subtotal = this._items().reduce((sum, item) => sum + item.lineTotal, 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    return {
      itemCount: this.itemCount(),
      subtotal,
      tax,
      deliveryFee,
      total: subtotal + tax + deliveryFee,
    };
  });

  addItem(pizza: Pizza, customization: PizzaCustomization): void {
    const lineTotal = calculatePizzaPrice(pizza, customization);
    const item: CartItem = {
      id: crypto.randomUUID(),
      pizza,
      customization,
      lineTotal,
    };
    this._items.update((items) => [...items, item]);
  }

  removeItem(itemId: string): void {
    this._items.update((items) => items.filter((i) => i.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }
    this._items.update((items) =>
      items.map((item) => {
        if (item.id !== itemId) return item;
        const customization = { ...item.customization, quantity };
        return {
          ...item,
          customization,
          lineTotal: calculatePizzaPrice(item.pizza, customization),
        };
      })
    );
  }

  clear(): void {
    this._items.set([]);
  }
}
