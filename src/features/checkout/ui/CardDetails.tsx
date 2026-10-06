'use client';

import { useId } from 'react';
import { MastercardBadge, VisaBadge } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { digitsOnly } from '@/shared/lib/digits';
import { FieldError } from '@/shared/ui/FieldError';
import { FormattedInput } from '@/shared/ui/FormattedInput';
import { useAppDispatch } from '@/store/hooks';
import { detectCardBrand, formatCardNumber, formatCvv, formatExpiry, type CardBrand } from '../model/card';
import { fieldChanged } from '../model/checkoutSlice';
import { useCheckoutField } from './useCheckoutField';

const inputClass =
  'block u-h-30 w-full u-rounded-5 border-[1.5px] border-ink bg-cream-light u-px-8 u-text-14 lg:h-[26px] lg:rounded-[5px] lg:px-2 lg:text-[15.5px] font-medium tracking-wide text-ink tabular-nums outline-none transition-shadow placeholder:font-normal placeholder:uppercase focus:border-navy focus:ring-2 focus:ring-navy/25 aria-invalid:border-terracotta';

type BadgeState = 'idle' | 'active' | 'dim';

const badgeState = (brand: CardBrand, badge: CardBrand): BadgeState =>
  brand === badge ? 'active' : brand === 'unknown' ? 'idle' : 'dim';

const badgeClass = (state: BadgeState) =>
  cn(
    'u-h-21 u-w-34.5 rounded-[4px] transition-all duration-200 lg:h-[26.25px] lg:w-[43px]',
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
    <div
      className={cn(
        'u-rounded-8 border-2 border-ink bg-sand u-px-10 u-pt-8 u-pb-10 lg:rounded-[8px] lg:px-2.5 lg:pt-2 lg:pb-2.5',
        className,
      )}
    >
      <div className="flex items-center u-gap-6 lg:gap-1.5">
        {/* Echo of the selected radio from the mockup; the real control is above. */}
        <span
          aria-hidden
          className="u-size-13 rounded-full border-[1.5px] border-ink bg-ink inset-ring-[2.5px] inset-ring-cream-light lg:size-[15px]"
        />
        <span className="sr-only">We accept Visa and Mastercard.</span>
        <span className="flex u-gap-2 lg:gap-[2px]">
          <VisaBadge className={badgeClass(badgeState(brand, 'visa'))} />
          <MastercardBadge className={badgeClass(badgeState(brand, 'mastercard'))} />
        </span>
      </div>

      <label
        htmlFor={ids.number}
        className="u-mt-6 block u-text-12 u-leading-18 font-semibold uppercase lg:mt-0.5 lg:text-[13px] lg:leading-4"
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

      <div className="u-mt-8 grid grid-cols-2 u-gap-10 lg:mt-1.5 lg:gap-2.5">
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
