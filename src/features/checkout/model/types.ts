import type { Cents } from '@/shared/lib/money';

export const PAYMENT_METHODS = ['card', 'paypal', 'apple-pay', 'bank-transfer'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Readonly<Record<PaymentMethod, string>> = {
  card: 'Credit / debit card',
  paypal: 'PayPal',
  'apple-pay': 'Apple Pay',
  'bank-transfer': 'Bank transfer',
};

export interface CheckoutValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export type CheckoutField = keyof CheckoutValues;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

/** Fields in the order they appear on screen; used to focus the first invalid one. */
export const FIELD_ORDER: readonly CheckoutField[] = [
  'name',
  'phone',
  'email',
  'address',
  'notes',
  'cardNumber',
  'cardExpiry',
  'cardCvv',
];

export interface OrderConfirmation {
  orderNumber: string;
  placedAt: string;
  customerName: string;
  email: string;
  total: Cents;
  paymentMethod: PaymentMethod;
}
