'use client';

import { useLayoutEffect, useRef, type ChangeEvent, type InputHTMLAttributes, type Ref } from 'react';
import { digitsOnly } from '@/shared/lib/digits';

interface FormattedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (formatted: string) => void;
  /** Turns raw input into its display form, e.g. "42424242" → "4242 4242". */
  format: (raw: string) => string;
  ref?: Ref<HTMLInputElement>;
}

/** Position right after the n-th digit of `text`. */
const caretAfterDigits = (text: string, count: number): number => {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i]) && ++seen === count) return i + 1;
  }
  return text.length;
};

/**
 * Digit input that re-formats as you type (card number, expiry) without
 * throwing the caret to the end when you edit in the middle.
 */
export function FormattedInput({ value, onValueChange, format, ref, ...inputProps }: FormattedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (pendingCaret.current === null || !input || document.activeElement !== input) return;
    input.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const caret = event.target.selectionStart ?? raw.length;
    const formatted = format(raw);
    // Count digits left of the caret; add any digit the formatter inserted (e.g. "4" → "04").
    const inserted = Math.max(0, digitsOnly(formatted).length - digitsOnly(raw).length);
    pendingCaret.current = caretAfterDigits(formatted, digitsOnly(raw.slice(0, caret)).length + inserted);
    onValueChange(formatted);
  };

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return <input ref={setRefs} value={value} onChange={handleChange} {...inputProps} />;
}
