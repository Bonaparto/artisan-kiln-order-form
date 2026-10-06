'use client';

import { useRef, type FormEvent, type ReactNode } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { placeOrder } from '../model/placeOrder';

interface CheckoutFormProps {
  children: ReactNode;
  className?: string;
  'aria-labelledby'?: string;
}

/**
 * The <form> around the checkout fields. On a blocked submit it moves focus to
 * the first invalid field (in screen order), so keyboard and screen-reader
 * users land right on the problem.
 */
export function CheckoutForm({ children, className, ...aria }: CheckoutFormProps) {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(placeOrder());
    if (placeOrder.rejected.match(result) && result.payload?.kind === 'invalid') {
      const [firstInvalid] = result.payload.fields;
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      }
    }
  };

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className={className} {...aria}>
      {children}
    </form>
  );
}
