'use client';

import type { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fieldBlurred, fieldChanged } from '../model/checkoutSlice';
import { selectFieldValue, selectVisibleError } from '../model/selectors';
import type { CheckoutField } from '../model/types';

/**
 * Binds an input to its checkout field in the store.
 * `format` lets card inputs normalise what the customer types.
 */
export function useCheckoutField(field: CheckoutField, format?: (raw: string) => string) {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => selectFieldValue(state, field));
  const error = useAppSelector((state) => selectVisibleError(state, field));

  return {
    value,
    error,
    inputProps: {
      name: field,
      value,
      'data-field': field,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        dispatch(fieldChanged({ field, value: format ? format(event.target.value) : event.target.value })),
      onBlur: () => dispatch(fieldBlurred(field)),
    },
  };
}
