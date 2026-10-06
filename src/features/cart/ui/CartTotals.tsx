'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Fragment } from 'react';
import { CheckIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { formatMoney } from '@/shared/lib/money';
import { AnimatedMoney } from '@/shared/ui/AnimatedMoney';
import { Bracketed } from '@/shared/ui/Bracketed';
import { useAppSelector } from '@/store/hooks';
import { FREE_SHIPPING_THRESHOLD } from '../model/pricing';
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
          ? 'gap-x-1 gap-y-[4px] text-[14px] sm:text-[17px] lg:gap-y-[3px] lg:text-[15px]'
          : 'gap-x-1.5 gap-y-0.5 text-[16px] lg:text-[15px]',
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
                  'flex h-[20px] min-w-[80px] items-center border-[1.5px] border-ink px-[3px] sm:h-[24px] sm:min-w-[104px] lg:h-[19px] lg:min-w-[86px]',
                  row.total && 'h-[22px] bg-sand sm:h-[26px] lg:h-[21px]',
                )}
              >
                <Bracketed className="h-[78%] w-full justify-end text-[13px] font-medium tabular-nums sm:text-[15.5px] lg:text-[13.5px]">
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

/** "Add $X more for free shipping" / "Free shipping unlocked". */
export function FreeShippingHint({ className }: { className?: string }) {
  const { subtotal, untilFreeShipping } = useAppSelector(selectCartTotals);
  const unlocked = subtotal > 0 && untilFreeShipping === 0;

  return (
    <div className={cn('min-h-[18px] text-[14px] leading-tight', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {subtotal > 0 && (
          <motion.p
            key={unlocked ? 'free' : 'fee'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={cn('flex items-center justify-end gap-1', unlocked ? 'text-sage-dark' : 'text-terracotta-dark')}
          >
            {unlocked ? (
              <>
                <CheckIcon className="size-4" /> Free shipping on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}
              </>
            ) : (
              <>Add {formatMoney(untilFreeShipping)} more for free shipping</>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
