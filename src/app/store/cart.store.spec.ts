import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';
import { MOCK_PIZZAS } from '../core/data/mock-pizzas';

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
    store.clear();
  });

  it('should start empty', () => {
    expect(store.isEmpty()).toBeTrue();
    expect(store.itemCount()).toBe(0);
  });

  it('should add items and compute summary', () => {
    store.addItem(MOCK_PIZZAS[0], {
      size: 'medium',
      quantity: 2,
      extraToppings: [],
      removeToppings: [],
    });

    expect(store.itemCount()).toBe(2);
    expect(store.summary().subtotal).toBeGreaterThan(0);
  });

  it('should remove items', () => {
    store.addItem(MOCK_PIZZAS[0], {
      size: 'small',
      quantity: 1,
      extraToppings: [],
      removeToppings: [],
    });
    const id = store.items()[0].id;
    store.removeItem(id);
    expect(store.isEmpty()).toBeTrue();
  });
});
