'use client';

import { motion } from 'framer-motion';
import { useId, useState } from 'react';
import { TileArt, type TileId } from '@/entities/tile';
import { formatMoney } from '@/shared/lib/money';
import { Dialog } from '@/shared/ui/Dialog';
import { orderFinished } from '@/store/actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectConfirmation } from '../model/selectors';
import { PAYMENT_METHOD_LABELS, type OrderConfirmation } from '../model/types';

const CELEBRATION_TILES: TileId[] = ['ocean-wave', 'yellow-star', 'terracotta-dot', 'forest-fern', 'azure-star'];

/** "Thank you" modal shown after the order went through; closing it starts a fresh order. */
export function OrderConfirmationDialog() {
  const dispatch = useAppDispatch();
  const confirmation = useAppSelector(selectConfirmation);
  const titleId = useId();
  // Keep the last confirmation around so the content doesn't vanish during the close transition.
  const [shown, setShown] = useState<OrderConfirmation | null>(confirmation);
  if (confirmation && confirmation !== shown) setShown(confirmation);

  const finish = () => dispatch(orderFinished());

  return (
    <Dialog open={confirmation !== null} onClose={finish} labelledBy={titleId}>
      {shown && (
        <div className="relative overflow-hidden rounded-[16px] border-2 border-ink bg-cream px-6 pt-6 pb-5 text-center shadow-lift">
          <div aria-hidden className="mb-3 flex justify-center gap-1.5">
            {CELEBRATION_TILES.map((tileId, index) => (
              <motion.span
                key={tileId}
                initial={{ opacity: 0, y: -18, rotate: index % 2 ? 14 : -14, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.08 * index }}
              >
                <TileArt tileId={tileId} className="size-9 rounded-[4px] border-[1.5px] border-ink" />
              </motion.span>
            ))}
          </div>
          <h2 id={titleId} className="text-[30px] leading-tight font-bold uppercase">
            Thank you, {shown.customerName.split(' ')[0]}!
          </h2>
          <p className="mt-1 text-[16px] text-ink-soft">
            Order <strong className="font-semibold text-ink">#{shown.orderNumber}</strong> is in the kiln queue.
          </p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-y border-dashed border-ink/30 py-3 text-left text-[16px]">
            <dt className="font-semibold uppercase">Total</dt>
            <dd className="text-right font-semibold tabular-nums">{formatMoney(shown.total)}</dd>
            <dt className="font-semibold uppercase">Payment</dt>
            <dd className="text-right">{PAYMENT_METHOD_LABELS[shown.paymentMethod]}</dd>
            <dt className="font-semibold uppercase">Receipt to</dt>
            <dd className="truncate text-right">{shown.email}</dd>
          </dl>
          <button
            type="button"
            onClick={finish}
            autoFocus
            className="mt-5 h-[40px] w-full rounded-[6px] border-2 border-ink bg-navy text-[19px] font-semibold text-cream-light uppercase shadow-ink-sm transition-colors hover:bg-navy-dark"
          >
            Start a new order
          </button>
        </div>
      )}
    </Dialog>
  );
}
