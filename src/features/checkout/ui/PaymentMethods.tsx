'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, type ReactNode } from 'react';
import { ApplePayButtonIcon, ApplePayIcon, BankIcon, CardIcon, PayPalIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { paymentMethodChanged } from '../model/checkoutSlice';
import { selectPaymentMethod } from '../model/selectors';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, type PaymentMethod } from '../model/types';
import { CardDetails } from './CardDetails';

const radioClass =
  'shrink-0 cursor-pointer appearance-none rounded-full border-[1.5px] border-ink bg-cream-light transition-colors checked:bg-navy checked:inset-ring-[2.5px] checked:inset-ring-cream-light';

const legendBox = 'border-[1.5px] border-ink bg-sand font-semibold uppercase leading-tight';

function usePaymentMethod() {
  const dispatch = useAppDispatch();
  const method = useAppSelector(selectPaymentMethod);
  return [method, (next: PaymentMethod) => dispatch(paymentMethodChanged(next))] as const;
}

interface OptionProps {
  name: string;
  value: PaymentMethod;
  checked: boolean;
  onSelect: (value: PaymentMethod) => void;
  className?: string;
  children: ReactNode;
}

function RadioOption({ name, value, checked, onSelect, className, children }: OptionProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-1.5', className)}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className={cn(radioClass, 'size-[15px]')}
      />
      {children}
    </label>
  );
}

const NOTES: Record<Exclude<PaymentMethod, 'card'>, string> = {
  paypal: 'After you place the order we hand you over to PayPal to approve the payment.',
  'apple-pay': 'Confirm the payment with Face ID or Touch ID right after placing the order.',
  'bank-transfer':
    'We email an invoice with our bank details. Your tiles go into the kiln once the transfer clears (1–2 business days).',
};

/** The panel under the method picker: card fields, or a short note for the other methods. */
function MethodDetails({ method, className }: { method: PaymentMethod; className?: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={method}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn('overflow-hidden', className)}
      >
        {method === 'card' ? (
          <CardDetails />
        ) : (
          <p className="u-rounded-8 border-[1.5px] border-dashed border-ink/60 bg-sand/60 u-px-10 u-py-7 u-text-13.5 leading-snug lg:rounded-[8px] lg:px-3 lg:py-2 lg:text-[15px]">
            <strong className="font-semibold uppercase">{PAYMENT_METHOD_LABELS[method]}:</strong> {NOTES[method]}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/** Desktop picker: two radios on a line, the details panel, then Apple Pay / Bank transfer cards. */
export function PaymentMethodsDesktop({ className }: { className?: string }) {
  const [method, select] = usePaymentMethod();
  const name = useId();

  const cardOption = (value: PaymentMethod, label: string, icon: ReactNode) => (
    <label
      className={cn(
        'flex min-h-[78px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[8px] border-[1.5px] border-ink px-2 pt-2 pb-2 transition-colors',
        method === value ? 'bg-sand' : 'hover:bg-sand/50',
      )}
    >
      <span className="flex items-center gap-2">
        <input
          type="radio"
          name={name}
          value={value}
          checked={method === value}
          onChange={() => select(value)}
          className={cn(radioClass, 'size-[15px]')}
        />
        {icon}
      </span>
      <span className="text-[16px] leading-none font-semibold uppercase">{label}</span>
    </label>
  );

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className={cn(legendBox, 'inline-block px-1.5 py-px text-[17.5px]')}>Select payment method:</legend>
      <div className="mt-2 flex items-center gap-x-7 pl-1 text-[17px] font-semibold uppercase">
        <RadioOption name={name} value="card" checked={method === 'card'} onSelect={select}>
          Credit/Debit card
        </RadioOption>
        <RadioOption name={name} value="paypal" checked={method === 'paypal'} onSelect={select}>
          <PayPalIcon className="h-[21px] w-[18px]" />
          PayPal
        </RadioOption>
      </div>
      <MethodDetails method={method} className="mt-2" />
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {cardOption('apple-pay', 'Apple Pay', <ApplePayIcon className="h-[27px] w-[63.5px]" />)}
        {cardOption('bank-transfer', 'Bank transfer', <BankIcon className="h-[32.5px] w-[37px]" />)}
      </div>
    </fieldset>
  );
}

const MOBILE_ICONS: Record<PaymentMethod, ReactNode> = {
  card: <CardIcon className="u-h-24.5 u-w-36.5" />,
  paypal: <PayPalIcon className="u-h-28 u-w-23.5" />,
  'apple-pay': <ApplePayButtonIcon className="u-h-28 u-w-46.5" />,
  'bank-transfer': <BankIcon className="u-h-28 u-w-31.5" />,
};

const MOBILE_LABELS: Record<PaymentMethod, ReactNode> = {
  card: (
    <>
      Credit/Debit
      <br />
      card
    </>
  ),
  paypal: 'PayPal',
  'apple-pay': 'Apple Pay',
  'bank-transfer': (
    <>
      Bank
      <br />
      transfer
    </>
  ),
};

/** Mobile picker: four tiles in a framed row, as in the mockup. */
export function PaymentMethodsMobile({ className }: { className?: string }) {
  const [method, select] = usePaymentMethod();
  const name = useId();

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className={cn(legendBox, 'flex u-h-19 items-center border-b-0 u-px-5 u-text-13')}>
        Select payment method:
      </legend>
      <div className="grid u-h-61.5 grid-cols-4 border-2 border-ink">
        {PAYMENT_METHODS.map((value, index) => (
          <label
            key={value}
            className={cn(
              'relative flex cursor-pointer flex-col items-center border-ink u-px-2 u-pt-8 u-pb-4 text-center transition-colors',
              index > 0 && 'border-l-[1.5px]',
              method === value ? 'bg-sand' : 'hover:bg-sand/40',
            )}
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={method === value}
              onChange={() => select(value)}
              className={cn(radioClass, 'absolute u-top-16 u-left-6 u-size-12.5')}
            />
            <span className="flex u-h-28 items-center u-pl-10">{MOBILE_ICONS[value]}</span>
            <span className="mt-auto u-text-10.5 leading-[1.02] font-semibold uppercase">{MOBILE_LABELS[value]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Mobile: the card fields (or a note for the other methods), placed after the mockup's sections. */
export function PaymentDetailsMobile({ className }: { className?: string }) {
  const [method] = usePaymentMethod();
  return <MethodDetails method={method} className={className} />;
}
