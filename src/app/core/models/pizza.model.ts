export type PizzaSize = 'small' | 'medium' | 'large';
export type PizzaCategory = 'classic' | 'premium' | 'veggie' | 'specialty';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  category: PizzaCategory;
  basePrice: number;
  imageUrl: string;
  toppings: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  rating: number;
  prepTimeMinutes: number;
}

export interface PizzaCustomization {
  size: PizzaSize;
  extraToppings: string[];
  removeToppings: string[];
  quantity: number;
  specialInstructions?: string;
}

export const SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  small: 0.8,
  medium: 1,
  large: 1.3,
};

export const EXTRA_TOPPING_PRICE = 1.5;

export function calculatePizzaPrice(
  pizza: Pizza,
  customization: PizzaCustomization
): number {
  const sizePrice = pizza.basePrice * SIZE_MULTIPLIERS[customization.size];
  const toppingsPrice = customization.extraToppings.length * EXTRA_TOPPING_PRICE;
  return (sizePrice + toppingsPrice) * customization.quantity;
}
