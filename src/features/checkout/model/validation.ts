import { CARD_LENGTHS, cvvLength, detectCardBrand, digitsOnly, passesLuhn } from './card';
import type { CheckoutErrors, CheckoutValues, PaymentMethod } from './types';

export const NOTES_MAX_LENGTH = 500;
/** Cards expiring further out than this are almost certainly a typo. */
const MAX_EXPIRY_YEARS_AHEAD = 20;

const EMAIL_PATTERN = /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]{2,}$/;
const PHONE_CHARACTERS = /^\+?[\d\s()-]+$/;

type Validator = (value: string) => string | undefined;

export const validateName: Validator = (value) => {
  const name = value.trim();
  if (!name) return 'Enter the customer name';
  if (name.length < 2) return 'Name looks too short';
  return undefined;
};

export const validatePhone: Validator = (value) => {
  const phone = value.trim();
  if (!phone) return 'Enter a phone number';
  const digits = digitsOnly(phone).length;
  if (!PHONE_CHARACTERS.test(phone) || digits < 7 || digits > 15) return 'Enter a valid phone number';
  return undefined;
};

export const validateEmail: Validator = (value) => {
  const email = value.trim();
  if (!email) return 'Enter an email address';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email, e.g. name@example.com';
  return undefined;
};

export const validateAddress: Validator = (value) => {
  const address = value.trim();
  if (!address) return 'Enter a shipping address';
  if (address.length < 5) return 'Address looks incomplete';
  return undefined;
};

export const validateNotes: Validator = (value) =>
  value.length > NOTES_MAX_LENGTH ? `Keep notes under ${NOTES_MAX_LENGTH} characters` : undefined;

export const validateCardNumber: Validator = (value) => {
  const digits = digitsOnly(value);
  if (!digits) return 'Enter the card number';
  const lengths = CARD_LENGTHS[detectCardBrand(digits)];
  if (digits.length < Math.min(...lengths)) return 'Card number is too short';
  if (!lengths.includes(digits.length) || !passesLuhn(digits)) return 'Card number is not valid';
  return undefined;
};

export function validateExpiry(value: string, now: Date = new Date()): string | undefined {
  const digits = digitsOnly(value);
  if (!digits) return 'Enter the expiry date';
  if (digits.length !== 4) return 'Use the MM / YY format';
  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));
  if (month < 1 || month > 12) return 'Month must be between 01 and 12';
  // A card is valid until the last day of its expiry month.
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  if (year < nowYear || (year === nowYear && month < nowMonth)) return 'This card has expired';
  if (year > nowYear + MAX_EXPIRY_YEARS_AHEAD) return 'Check the expiry year';
  return undefined;
}

export function validateCvv(value: string, cardNumber: string): string | undefined {
  const digits = digitsOnly(value);
  const expected = cvvLength(detectCardBrand(digitsOnly(cardNumber)));
  if (!digits) return 'Enter the CVV';
  if (digits.length !== expected) return `CVV must be ${expected} digits`;
  return undefined;
}

/**
 * Validates the whole checkout form. Card fields are only required when the
 * customer pays by card. Returns an empty object when everything is valid.
 */
export function validateCheckout(
  values: CheckoutValues,
  paymentMethod: PaymentMethod,
  now: Date = new Date(),
): CheckoutErrors {
  const errors: CheckoutErrors = {
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    email: validateEmail(values.email),
    address: validateAddress(values.address),
    notes: validateNotes(values.notes),
  };

  if (paymentMethod === 'card') {
    errors.cardNumber = validateCardNumber(values.cardNumber);
    errors.cardExpiry = validateExpiry(values.cardExpiry, now);
    errors.cardCvv = validateCvv(values.cardCvv, values.cardNumber);
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as CheckoutErrors;
}
