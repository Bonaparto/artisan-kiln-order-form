'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { TileId } from '@/entities/tile';
import { AddTileButton } from './AddTileButton';
import { CartTable } from './CartTable';
import { CartTotals } from './CartTotals';

interface CartPanelProps {
  className?: string;
  /** Illustration shown next to "Add new tile to cart". */
  illustration?: ReactNode;
  /** Extra content under the totals (e.g. the free-shipping hint on mobile). */
  footer?: ReactNode;
}

/** Cart table + "Add new tile" + boxed totals — the same block in both layouts. */
export function CartPanel({ className, illustration, footer }: CartPanelProps) {
  const [justAdded, setJustAdded] = useState<TileId | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={className}>
      <CartTable focusTileId={justAdded} onEmptied={() => addButtonRef.current?.focus()} />
      <div className="mt-[3px] flex flex-wrap items-start justify-between gap-x-2 gap-y-1 lg:mt-px">
        <div className="flex items-center">
          {illustration}
          <AddTileButton ref={addButtonRef} onAdded={setJustAdded} className="mt-1.5 lg:mt-1" />
        </div>
        <CartTotals variant="boxed" className="mt-1 ml-auto" />
      </div>
      {footer}
    </div>
  );
}
