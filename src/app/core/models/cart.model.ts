import { Pizza, PizzaCustomization } from './pizza.model';

export interface CartItem {
  id: string;
  pizza: Pizza;
  customization: PizzaCustomization;
  lineTotal: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 3.99;
export const FREE_DELIVERY_THRESHOLD = 25;
