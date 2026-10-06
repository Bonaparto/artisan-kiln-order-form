'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { TileId } from '@/entities/tile';
import { AddTileButton } from './AddTileButton';
import type { RenderSwatch } from './CartRow';
import { CartTable } from './CartTable';
import { CartTotals } from './CartTotals';

interface CartPanelProps {
  className?: string;
  /** Illustration shown next to "Add new tile to cart". */
  illustration?: ReactNode;
  renderSwatch?: RenderSwatch;
}

/** Cart table + "Add new tile" + boxed totals — the same block in both layouts. */
export function CartPanel({ className, illustration, renderSwatch }: CartPanelProps) {
  const [justAdded, setJustAdded] = useState<TileId | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={className}>
      <CartTable focusTileId={justAdded} onEmptied={() => addButtonRef.current?.focus()} renderSwatch={renderSwatch} />
      <div className="flex items-start justify-between">
        <div className="flex items-start u-pt-6 u-pl-4 lg:pt-[6px] lg:pl-[9px]">
          {illustration}
          <AddTileButton ref={addButtonRef} onAdded={setJustAdded} />
        </div>
        {/* The boxes hang off the table, sharing its bottom border. */}
        <CartTotals variant="boxed" className="-mt-[1.5px]" />
      </div>
    </div>
  );
}
