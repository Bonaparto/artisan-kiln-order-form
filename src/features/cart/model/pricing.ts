import { dollars, type Cents } from '@/shared/lib/money';

/** Shipping is free once the subtotal is strictly greater than this. */
export const FREE_SHIPPING_THRESHOLD: Cents = dollars(500);
export const SHIPPING_FEE: Cents = dollars(25);

export interface PricedLine {
  /** Square feet. */
  quantity: number;
  /** Price per square foot. */
  unitPrice: Cents;
}

export interface OrderTotals {
  subtotal: Cents;
  shipping: Cents;
  grandTotal: Cents;
}

export const calculateLineTotal = ({ quantity, unitPrice }: PricedLine): Cents => quantity * unitPrice;

/** Subtotal = Σ quantity × unit price. */
export const calculateSubtotal = (lines: readonly PricedLine[]): Cents =>
  lines.reduce((sum, line) => sum + calculateLineTotal(line), 0);

/**
 * Free over $500, otherwise a flat $25.
 * An empty order has nothing to ship, so it is not charged the flat fee.
 */
export const calculateShipping = (subtotal: Cents): Cents =>
  subtotal <= 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

export const calculateTotals = (lines: readonly PricedLine[]): OrderTotals => {
  const subtotal = calculateSubtotal(lines);
  const shipping = calculateShipping(subtotal);
  return { subtotal, shipping, grandTotal: subtotal + shipping };
};
