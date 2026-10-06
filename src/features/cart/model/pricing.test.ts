import { describe, expect, it } from 'vitest';
import { dollars } from '@/shared/lib/money';
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  amountUntilFreeShipping,
  calculateLineTotal,
  calculateShipping,
  calculateSubtotal,
  calculateTotals,
} from './pricing';

/** The order from the mockups: Ocean Wave, Forest Fern, Terracotta Dot, Yellow Star. */
const MOCKUP_ORDER = [
  { quantity: 150, unitPrice: dollars(28) },
  { quantity: 75, unitPrice: dollars(30) },
  { quantity: 200, unitPrice: dollars(26) },
  { quantity: 50, unitPrice: dollars(29) },
];

describe('calculateLineTotal', () => {
  it('multiplies square feet by the unit price', () => {
    expect(calculateLineTotal({ quantity: 150, unitPrice: dollars(28) })).toBe(dollars(4200));
  });
});

describe('calculateSubtotal', () => {
  it('sums quantity × unit price over every line', () => {
    // 4 200 + 2 250 + 5 200 + 1 450
    expect(calculateSubtotal(MOCKUP_ORDER)).toBe(dollars(13_100));
  });

  it('is zero for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('counts a line with no quantity as zero', () => {
    expect(
      calculateSubtotal([
        { quantity: 0, unitPrice: dollars(28) },
        { quantity: 2, unitPrice: dollars(30) },
      ]),
    ).toBe(dollars(60));
  });

  it('does not drift on fractional prices (cents are integers)', () => {
    // 0.1 + 0.2 in floating point would be 0.30000000000000004
    expect(
      calculateSubtotal([
        { quantity: 1, unitPrice: dollars(0.1) },
        { quantity: 1, unitPrice: dollars(0.2) },
      ]),
    ).toBe(dollars(0.3));
  });
});

describe('calculateShipping', () => {
  it('uses the business-rule constants', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(dollars(500));
    expect(SHIPPING_FEE).toBe(dollars(25));
  });

  it('charges $25 up to and including $500', () => {
    expect(calculateShipping(dollars(0.01))).toBe(dollars(25));
    expect(calculateShipping(dollars(499.99))).toBe(dollars(25));
    expect(calculateShipping(dollars(500))).toBe(dollars(25));
  });

  it('is free once the subtotal is greater than $500', () => {
    expect(calculateShipping(dollars(500.01))).toBe(0);
    expect(calculateShipping(dollars(13_100))).toBe(0);
  });

  it('does not charge shipping when there is nothing to ship', () => {
    expect(calculateShipping(0)).toBe(0);
  });
});

describe('calculateTotals', () => {
  it('ships the mockup order for free', () => {
    expect(calculateTotals(MOCKUP_ORDER)).toEqual({
      subtotal: dollars(13_100),
      shipping: 0,
      grandTotal: dollars(13_100),
    });
  });

  it('adds the flat fee to small orders', () => {
    const totals = calculateTotals([
      { quantity: 11, unitPrice: dollars(28) },
      { quantity: 1, unitPrice: dollars(30) },
      { quantity: 1, unitPrice: dollars(26) },
      { quantity: 1, unitPrice: dollars(29) },
    ]);
    expect(totals).toEqual({ subtotal: dollars(393), shipping: dollars(25), grandTotal: dollars(418) });
  });

  it('grand total is always subtotal + shipping', () => {
    for (const quantity of [0, 1, 17, 18, 19, 500]) {
      const { subtotal, shipping, grandTotal } = calculateTotals([{ quantity, unitPrice: dollars(28) }]);
      expect(grandTotal).toBe(subtotal + shipping);
    }
  });
});

describe('amountUntilFreeShipping', () => {
  it('is the gap to the first cent over $500', () => {
    expect(amountUntilFreeShipping(dollars(393))).toBe(dollars(107.01));
    expect(amountUntilFreeShipping(dollars(500))).toBe(1);
  });

  it('is zero once shipping is free', () => {
    expect(amountUntilFreeShipping(dollars(500.01))).toBe(0);
  });
});
