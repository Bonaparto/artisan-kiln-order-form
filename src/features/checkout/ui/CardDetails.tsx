'use client';

import { useId } from 'react';
import { MastercardIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { digitsOnly } from '@/shared/lib/digits';
import { FieldError } from '@/shared/ui/FieldError';
import { FormattedInput } from '@/shared/ui/FormattedInput';
import { useAppDispatch } from '@/store/hooks';
import { detectCardBrand, formatCardNumber, formatCvv, formatExpiry, type CardBrand } from '../model/card';
import { fieldChanged } from '../model/checkoutSlice';
import { useCheckoutField } from './useCheckoutField';

const inputClass =
  'block w-full rounded-[5px] border-[1.5px] border-ink bg-cream-light px-2 py-1 text-[16px] lg:py-px lg:text-[15.5px] font-medium tracking-wide text-ink tabular-nums outline-none transition-shadow placeholder:font-normal placeholder:uppercase focus:border-navy focus:ring-2 focus:ring-navy/25 aria-invalid:border-terracotta';

type BadgeState = 'idle' | 'active' | 'dim';

const badgeState = (brand: CardBrand, badge: CardBrand): BadgeState =>
  brand === badge ? 'active' : brand === 'unknown' ? 'idle' : 'dim';

const badgeClass = (state: BadgeState) =>
  cn(
    'flex h-[23px] w-[40px] items-center justify-center rounded-[3px] border-[1.5px] border-ink bg-cream-light transition-all duration-200',
    state === 'active' && 'ring-2 ring-navy ring-offset-1 ring-offset-sand',
    state === 'dim' && 'opacity-35 grayscale',
  );

/** Card number, expiry and CVV — shown while "Credit/Debit card" is selected. */
export function CardDetails({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const number = useCheckoutField('cardNumber');
  const expiry = useCheckoutField('cardExpiry');
  const cvv = useCheckoutField('cardCvv', formatCvv);
  const brand = detectCardBrand(digitsOnly(number.value));
  const ids = { number: useId(), expiry: useId(), cvv: useId() };

  return (
    <div className={cn('rounded-[8px] border-2 border-ink bg-sand px-2.5 pt-2 pb-2.5', className)}>
      <div className="flex items-center gap-1.5">
        {/* Echo of the selected radio from the mockup; the real control is above. */}
        <span
          aria-hidden
          className="size-[15px] rounded-full border-[1.5px] border-ink bg-ink inset-ring-[2.5px] inset-ring-cream-light"
        />
        <span className="sr-only">We accept Visa and Mastercard.</span>
        <span aria-hidden className={badgeClass(badgeState(brand, 'visa'))}>
          <span className="text-[14px] font-extrabold tracking-tight text-navy-dark italic">VISA</span>
        </span>
        <span aria-hidden className={badgeClass(badgeState(brand, 'mastercard'))}>
          <MastercardIcon className="h-[17px]" />
        </span>
      </div>

      <label
        htmlFor={ids.number}
        className="mt-1 block text-[13px] leading-5 font-semibold uppercase lg:mt-0.5 lg:leading-4"
      >
        Card number
      </label>
      <FormattedInput
        id={ids.number}
        format={formatCardNumber}
        value={number.value}
        onValueChange={(value) => dispatch(fieldChanged({ field: 'cardNumber', value }))}
        onBlur={number.inputProps.onBlur}
        data-field="cardNumber"
        name="cardNumber"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="1234 4556 7723 8990"
        aria-invalid={number.error ? true : undefined}
        aria-describedby={number.error ? `${ids.number}-error` : undefined}
        className={inputClass}
      />
      <FieldError id={`${ids.number}-error`} message={number.error} />

      <div className="mt-2 grid grid-cols-2 gap-2.5 lg:mt-1.5">
        <div>
          <label htmlFor={ids.expiry} className="sr-only">
            Expiration date, MM / YY
          </label>
          <FormattedInput
            id={ids.expiry}
            format={formatExpiry}
            value={expiry.value}
            onValueChange={(value) => dispatch(fieldChanged({ field: 'cardExpiry', value }))}
            onBlur={expiry.inputProps.onBlur}
            data-field="cardExpiry"
            name="cardExpiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="Expiry MM / YY"
            aria-invalid={expiry.error ? true : undefined}
            aria-describedby={expiry.error ? `${ids.expiry}-error` : undefined}
            className={inputClass}
          />
          <FieldError id={`${ids.expiry}-error`} message={expiry.error} />
        </div>
        <div>
          <label htmlFor={ids.cvv} className="sr-only">
            CVV security code
          </label>
          <input
            id={ids.cvv}
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            placeholder="CVV"
            aria-invalid={cvv.error ? true : undefined}
            aria-describedby={cvv.error ? `${ids.cvv}-error` : undefined}
            className={inputClass}
            {...cvv.inputProps}
          />
          <FieldError id={`${ids.cvv}-error`} message={cvv.error} />
        </div>
      </div>
    </div>
  );
}
