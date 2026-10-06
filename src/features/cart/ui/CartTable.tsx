'use client';

import { AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import type { TileId } from '@/entities/tile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { itemRemoved, sampleCartRestored } from '../model/cartSlice';
import { selectCartLines, type CartLine } from '../model/selectors';
import { CartRow } from './CartRow';

const headCell = 'border-[1.5px] border-ink px-1 font-semibold';

interface CartTableProps {
  /** Row whose quantity field takes focus when it mounts (a tile that was just added). */
  focusTileId?: TileId | null;
  /** Called when the cart becomes empty, so focus can move somewhere sensible. */
  onEmptied?: () => void;
}

export function CartTable({ focusTileId, onEmptied }: CartTableProps) {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const tableRef = useRef<HTMLTableElement>(null);

  const removeLine = (line: CartLine) => {
    const index = lines.findIndex(({ tileId }) => tileId === line.tileId);
    // A row that is already animating out can still be clicked; ignore it.
    if (index === -1) return;
    const neighbour = lines[index + 1] ?? lines[index - 1];
    dispatch(itemRemoved(line.tileId));
    // The removed button disappears; keep keyboard users in the table.
    requestAnimationFrame(() => {
      if (!neighbour) return onEmptied?.();
      tableRef.current?.querySelector<HTMLElement>(`[data-remove-button="${neighbour.tileId}"]`)?.focus();
    });
  };

  return (
    <table ref={tableRef} className="w-full table-fixed border-collapse border-2 border-ink text-center">
      <caption className="sr-only">Tiles in your cart</caption>
      <colgroup>
        <col className="w-[26%] lg:w-[27.5%]" />
        <col className="w-[18%] lg:w-[19.8%]" />
        <col className="w-[17%] lg:w-[17.4%]" />
        <col className="w-[20%] lg:w-[18.4%]" />
        <col className="w-[19%] lg:w-[16.9%]" />
      </colgroup>
      <thead className="bg-sand text-[11.5px] leading-[1.05] uppercase sm:text-[13px]">
        <tr className="h-[34px] sm:h-[44px] lg:h-[41px]">
          <th scope="col" className={headCell}>
            Tile collection
          </th>
          <th scope="col" className={headCell}>
            Item
          </th>
          <th scope="col" className={headCell}>
            Quantity <span className="block font-medium normal-case">(sq. ft.)</span>
          </th>
          <th scope="col" className={headCell}>
            Unit price <span className="block font-medium">($)</span>
          </th>
          <th scope="col" className={headCell}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <CartRow key={line.tileId} line={line} autoFocus={line.tileId === focusTileId} onRemove={removeLine} />
          ))}
        </AnimatePresence>
        {lines.length === 0 && (
          <tr>
            <td colSpan={5} className="border-[1.5px] border-ink px-3 py-5 text-[15px]">
              <p className="font-semibold uppercase">Your cart is empty</p>
              <p className="mt-1 text-ink-muted">
                Add a tile below, or{' '}
                <button
                  type="button"
                  onClick={() => dispatch(sampleCartRestored())}
                  className="font-semibold text-navy underline decoration-navy/40 underline-offset-2 hover:decoration-navy"
                >
                  restore the sample order
                </button>
                .
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
