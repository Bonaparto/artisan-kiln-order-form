import { describe, expect, it } from 'vitest';
import { detectCardBrand, formatCardNumber, formatCvv, formatExpiry, passesLuhn } from './card';

describe('detectCardBrand', () => {
  it.each([
    ['4242424242424242', 'visa'],
    ['5555555555554444', 'mastercard'],
    ['2223003122003222', 'mastercard'],
    ['378282246310005', 'amex'],
    ['6011111111111117', 'discover'],
    ['9999', 'unknown'],
    ['', 'unknown'],
  ])('%s → %s', (digits, brand) => {
    expect(detectCardBrand(digits)).toBe(brand);
  });
});

describe('passesLuhn', () => {
  it.each(['4242424242424242', '5555555555554444', '378282246310005', '6011111111111117'])(
    'accepts the network test number %s',
    (digits) => {
      expect(passesLuhn(digits)).toBe(true);
    },
  );

  it('rejects a mistyped number and non-digits', () => {
    expect(passesLuhn('4242424242424241')).toBe(false);
    expect(passesLuhn('1234 4556 7723 8990')).toBe(false);
    expect(passesLuhn('')).toBe(false);
  });
});

describe('formatCardNumber', () => {
  it('groups digits by four and drops everything else', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('4242-42a42')).toBe('4242 4242');
    expect(formatCardNumber('42424')).toBe('4242 4');
  });

  it('uses 4-6-5 groups for American Express', () => {
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
  });

  it('stops at the longest valid length for the brand', () => {
    expect(formatCardNumber('4'.repeat(25)).replace(/\s/g, '')).toHaveLength(19);
    expect(formatCardNumber('37'.repeat(10)).replace(/\s/g, '')).toHaveLength(15);
  });
});

describe('formatExpiry', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['12', '12'],
    ['123', '12 / 3'],
    ['1230', '12 / 30'],
    ['12/30', '12 / 30'],
    ['12 / 304', '12 / 30'],
    ['4', '04'],
    ['428', '04 / 28'],
    ['ab', ''],
  ])('%j → %j', (input, expected) => {
    expect(formatExpiry(input)).toBe(expected);
  });
});

describe('formatCvv', () => {
  it('keeps at most four digits', () => {
    expect(formatCvv('12a34 5')).toBe('1234');
  });
});
