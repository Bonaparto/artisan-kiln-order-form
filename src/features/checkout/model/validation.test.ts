import { describe, expect, it } from 'vitest';
import type { CheckoutValues } from './types';
import {
  NOTES_MAX_LENGTH,
  validateAddress,
  validateCardNumber,
  validateCheckout,
  validateCvv,
  validateEmail,
  validateExpiry,
  validateName,
  validateNotes,
  validatePhone,
} from './validation';

// Fixed "today" so expiry checks don't depend on when the tests run.
const NOW = new Date(2026, 9, 6); // 6 October 2026

const VALID: CheckoutValues = {
  name: 'Amelia Smith',
  phone: '+1 (555) 012-3456',
  email: 'amelia@artisankiln.com',
  address: '12 Pottery Lane, Santa Fe, NM 87501',
  notes: '',
  cardNumber: '4242 4242 4242 4242',
  cardExpiry: '12 / 30',
  cardCvv: '123',
};

describe('required fields', () => {
  it('rejects blank and whitespace-only values', () => {
    expect(validateName('   ')).toBe('Enter the customer name');
    expect(validatePhone('')).toBe('Enter a phone number');
    expect(validateEmail(' ')).toBe('Enter an email address');
    expect(validateAddress('')).toBe('Enter a shipping address');
  });

  it('accepts reasonable values', () => {
    expect(validateName('Jo')).toBeUndefined();
    expect(validateAddress('1 Clay St')).toBeUndefined();
  });

  it('flags values that are clearly too short', () => {
    expect(validateName('J')).toBe('Name looks too short');
    expect(validateAddress('Main')).toBe('Address looks incomplete');
  });

  it('keeps project notes optional but bounded', () => {
    expect(validateNotes('')).toBeUndefined();
    expect(validateNotes('x'.repeat(NOTES_MAX_LENGTH))).toBeUndefined();
    expect(validateNotes('x'.repeat(NOTES_MAX_LENGTH + 1))).toMatch(/under 500/);
  });
});

describe('validateEmail', () => {
  it.each(['amelia@artisankiln.com', 'a.b+tiles@studio.co.uk', '  padded@example.org  '])('accepts %s', (email) => {
    expect(validateEmail(email)).toBeUndefined();
  });

  it.each(['amelia', 'amelia@', '@kiln.com', 'amelia@kiln', 'amelia@kiln.c', 'a b@kiln.com', 'amelia@@kiln.com'])(
    'rejects %s',
    (email) => {
      expect(validateEmail(email)).toMatch(/valid email/);
    },
  );
});

describe('validatePhone', () => {
  it.each(['+1 (555) 012-3456', '5550123456', '+44 20 7946 0958'])('accepts %s', (phone) => {
    expect(validatePhone(phone)).toBeUndefined();
  });

  it.each(['12345', '555-CALL-NOW', '+1234567890123456'])('rejects %s', (phone) => {
    expect(validatePhone(phone)).toBe('Enter a valid phone number');
  });
});

describe('validateCardNumber', () => {
  it('requires a number', () => {
    expect(validateCardNumber('')).toBe('Enter the card number');
  });

  it('reports a number that is too short', () => {
    expect(validateCardNumber('4242 4242')).toBe('Card number is too short');
  });

  it('runs the Luhn checksum', () => {
    expect(validateCardNumber('4242 4242 4242 4241')).toBe('Card number is not valid');
    expect(validateCardNumber('4242 4242 4242 4242')).toBeUndefined();
    expect(validateCardNumber('5555 5555 5555 4444')).toBeUndefined();
  });

  it('rejects the placeholder from the mockup', () => {
    expect(validateCardNumber('1234 4556 7723 8990')).toBe('Card number is not valid');
  });
});

describe('validateExpiry', () => {
  it('needs a complete MM / YY date', () => {
    expect(validateExpiry('', NOW)).toBe('Enter the expiry date');
    expect(validateExpiry('12 / 3', NOW)).toBe('Use the MM / YY format');
  });

  it('checks the month', () => {
    expect(validateExpiry('13 / 30', NOW)).toBe('Month must be between 01 and 12');
    expect(validateExpiry('00 / 30', NOW)).toBe('Month must be between 01 and 12');
  });

  it('treats a card as valid through the end of its expiry month', () => {
    expect(validateExpiry('10 / 26', NOW)).toBeUndefined();
    expect(validateExpiry('09 / 26', NOW)).toBe('This card has expired');
    expect(validateExpiry('12 / 25', NOW)).toBe('This card has expired');
  });

  it('rejects dates implausibly far ahead', () => {
    expect(validateExpiry('12 / 46', NOW)).toBeUndefined();
    expect(validateExpiry('01 / 47', NOW)).toBe('Check the expiry year');
  });
});

describe('validateCvv', () => {
  it('expects three digits, or four for American Express', () => {
    expect(validateCvv('', '4242424242424242')).toBe('Enter the CVV');
    expect(validateCvv('12', '4242424242424242')).toBe('CVV must be 3 digits');
    expect(validateCvv('123', '4242424242424242')).toBeUndefined();
    expect(validateCvv('123', '378282246310005')).toBe('CVV must be 4 digits');
    expect(validateCvv('1234', '378282246310005')).toBeUndefined();
  });
});

describe('validateCheckout', () => {
  it('returns no errors for a complete card payment', () => {
    expect(validateCheckout(VALID, 'card', NOW)).toEqual({});
  });

  it('lists every problem of an empty form', () => {
    const empty = Object.fromEntries(Object.keys(VALID).map((key) => [key, ''])) as unknown as CheckoutValues;
    expect(Object.keys(validateCheckout(empty, 'card', NOW))).toEqual([
      'name',
      'phone',
      'email',
      'address',
      'cardNumber',
      'cardExpiry',
      'cardCvv',
    ]);
  });

  it('only asks for card details when paying by card', () => {
    const noCard = { ...VALID, cardNumber: '', cardExpiry: '', cardCvv: '' };
    expect(Object.keys(validateCheckout(noCard, 'card', NOW))).toEqual(['cardNumber', 'cardExpiry', 'cardCvv']);
    for (const method of ['paypal', 'apple-pay', 'bank-transfer'] as const) {
      expect(validateCheckout(noCard, method, NOW)).toEqual({});
    }
  });
});
