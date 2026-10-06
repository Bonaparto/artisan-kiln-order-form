/**
 * Money is stored as an integer number of cents everywhere in the app, so
 * sums never pick up floating-point noise (0.1 + 0.2 !== 0.3).
 */
export type Cents = number;

/** Converts a dollar amount (e.g. 28.5) to cents (2850). */
export const dollars = (amount: number): Cents => Math.round(amount * 100);

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** 1310000 → "$13,100.00" */
export const formatMoney = (amount: Cents): string => usdFormatter.format(amount / 100);
