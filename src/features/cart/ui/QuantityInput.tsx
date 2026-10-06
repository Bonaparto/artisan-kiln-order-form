'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { TileId } from '@/entities/tile';
import { cn } from '@/shared/lib/cn';
import { digitsOnly } from '@/shared/lib/digits';
import { Bracketed } from '@/shared/ui/Bracketed';
import { useAppDispatch } from '@/store/hooks';
import { MAX_QUANTITY, quantityChanged } from '../model/cartSlice';

interface QuantityInputProps {
  tileId: TileId;
  tileName: string;
  quantity: number;
  /** Focus and select the value on mount (used right after a tile is added). */
  autoFocus?: boolean;
}

/**
 * Square-feet field: digits only, ↑/↓ step by 1, Shift+↑/↓ by 10.
 * A cleared field reads as 0 and shows empty brackets, like the mobile mockup.
 */
export function QuantityInput({ tileId, tileName, quantity, autoFocus = false }: QuantityInputProps) {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [autoFocus]);

  const setQuantity = (next: number) => dispatch(quantityChanged({ tileId, quantity: next }));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      setQuantity(quantity + (event.key === 'ArrowUp' ? step : -step));
    } else if (event.key === 'Enter') {
      // Commit instead of submitting the surrounding checkout form.
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const missing = quantity === 0;

  return (
    <Bracketed className={cn('u-h-17 u-text-15.5 lg:h-[20px] lg:text-[20px]', missing && 'text-terracotta')}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={String(MAX_QUANTITY).length}
        name={`quantity-${tileId}`}
        aria-label={`${tileName} quantity, square feet`}
        aria-invalid={missing || undefined}
        value={missing ? '' : String(quantity)}
        onChange={(event) => setQuantity(Number(digitsOnly(event.target.value)))}
        onKeyDown={handleKeyDown}
        onFocus={(event) => event.currentTarget.select()}
        className={cn(
          'rounded-[2px] bg-transparent text-center leading-none font-medium text-ink tabular-nums outline-none focus:bg-mustard-light/30',
          // The brackets hug the number: room for three digits, four when needed.
          quantity >= 1000 ? 'w-[2em]' : 'w-[1.5em]',
        )}
      />
    </Bracketed>
  );
}
