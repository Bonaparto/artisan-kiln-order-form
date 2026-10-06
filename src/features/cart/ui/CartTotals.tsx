'use client';

import { Fragment } from 'react';
import { cn } from '@/shared/lib/cn';
import { AnimatedMoney } from '@/shared/ui/AnimatedMoney';
import { Bracketed } from '@/shared/ui/Bracketed';
import { useAppSelector } from '@/store/hooks';
import { selectCartTotals } from '../model/selectors';

interface CartTotalsProps {
  /** `boxed`: framed cells under the cart table. `inline`: bracketed values in the order summary. */
  variant: 'boxed' | 'inline';
  className?: string;
}

export function CartTotals({ variant, className }: CartTotalsProps) {
  const { subtotal, shipping, grandTotal } = useAppSelector(selectCartTotals);
  const rows = [
    { label: 'Subtotal', value: subtotal },
    { label: 'Shipping', value: shipping },
    { label: 'Grand total', value: grandTotal, total: true },
  ];

  return (
    <dl
      className={cn(
        'grid grid-cols-[auto_auto] items-center justify-end font-semibold uppercase',
        variant === 'boxed'
          ? 'u-gap-x-6 u-gap-y-1.5 u-text-13.5 lg:gap-x-[7px] lg:gap-y-[2.5px] lg:text-[15.5px]'
          : 'gap-x-1.5 gap-y-0.5 text-[16px] lg:text-[15.5px]',
        className,
      )}
    >
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt className="text-right leading-none whitespace-nowrap">{row.label}:</dt>
          <dd className="leading-none">
            {variant === 'boxed' ? (
              <span
                className={cn(
                  'flex u-h-18 u-w-55 items-center border-[1.5px] border-ink px-[2px] lg:h-[21px] lg:w-[66px]',
                  row.total && 'bg-sand',
                )}
              >
                <Bracketed className="h-[76%] w-full justify-end u-text-10.5 font-medium tabular-nums lg:text-[13px]">
                  <AnimatedMoney value={row.value} />
                </Bracketed>
              </span>
            ) : (
              <Bracketed className="h-[1.15em] min-w-[5.6em] justify-end font-medium tabular-nums">
                <AnimatedMoney value={row.value} />
              </Bracketed>
            )}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
