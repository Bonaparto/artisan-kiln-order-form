/** Card helpers shared by validation and input formatting. */

import { digitsOnly } from '@/shared/lib/digits';

export { digitsOnly };

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720))/.test(digits)) return 'mastercard';
  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover';
  return 'unknown';
}

/** Accepted card-number lengths per brand. */
export const CARD_LENGTHS: Readonly<Record<CardBrand, readonly number[]>> = {
  visa: [13, 16, 19],
  mastercard: [16],
  amex: [15],
  discover: [16, 19],
  unknown: [13, 14, 15, 16, 17, 18, 19],
};

export const maxCardLength = (brand: CardBrand): number => Math.max(...CARD_LENGTHS[brand]);
export const cvvLength = (brand: CardBrand): number => (brand === 'amex' ? 4 : 3);

/** Luhn (mod 10) checksum used by every major card network. */
export function passesLuhn(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** "4242424242424242" → "4242 4242 4242 4242"; Amex uses 4-6-5 groups. */
export function formatCardNumber(value: string): string {
  const digits = digitsOnly(value);
  const brand = detectCardBrand(digits);
  const trimmed = digits.slice(0, maxCardLength(brand));
  if (brand === 'amex') {
    return [trimmed.slice(0, 4), trimmed.slice(4, 10), trimmed.slice(10)].filter(Boolean).join(' ');
  }
  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** "1228" → "12 / 28"; a leading 2–9 is read as a single-digit month ("4" → "04"). */
export function formatExpiry(value: string): string {
  let digits = digitsOnly(value).slice(0, 4);
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export const formatCvv = (value: string): string => digitsOnly(value).slice(0, 4);
