import { CartItem } from './cart.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'baking'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusEvent {
  orderId: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  estimatedMinutes?: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  address: DeliveryAddress;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: OrderStatusEvent[];
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  baking: 'Baking',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'baking',
  'out_for_delivery',
  'delivered',
];
