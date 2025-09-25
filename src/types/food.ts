export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  available: boolean;
  preparationTime: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minOrderAmount?: number;
  maxDiscount?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  loyaltyPointsUsed: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  orderTime: Date;
  estimatedTime: Date;
  couponCode?: string;
}

export interface CheckoutState {
  couponCode: string;
  discount: number;
  loyaltyPointsUsed: number;
  paymentMethod: 'cash' | 'card' | null;
  isProcessing: boolean;
  orderPlaced: boolean;
}