'use client';

import { AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import type { TileId } from '@/entities/tile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { itemRemoved, sampleCartRestored } from '../model/cartSlice';
import { selectCartLines, type CartLine } from '../model/selectors';
import { CartRow, type RenderSwatch } from './CartRow';

const headCell = 'border-[1.5px] border-ink px-0.5 font-semibold';

interface CartTableProps {
  /** Row whose quantity field takes focus when it mounts (a tile that was just added). */
  focusTileId?: TileId | null;
  /** Called when the cart becomes empty, so focus can move somewhere sensible. */
  onEmptied?: () => void;
  renderSwatch?: RenderSwatch;
}

export function CartTable({ focusTileId, onEmptied, renderSwatch }: CartTableProps) {
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
        <col className="w-[27.4%]" />
        <col className="w-[19.9%]" />
        <col className="w-[17.4%]" />
        <col className="w-[18.4%]" />
        <col className="w-[16.9%]" />
      </colgroup>
      <thead className="bg-sand u-text-12.5 leading-[1.05] uppercase lg:text-[15px]">
        <tr className="u-h-29.5 lg:h-[41px]">
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
            <CartRow
              key={line.tileId}
              line={line}
              autoFocus={line.tileId === focusTileId}
              onRemove={removeLine}
              renderSwatch={renderSwatch}
            />
          ))}
        </AnimatePresence>
        {lines.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="border-[1.5px] border-ink u-px-12 u-py-16 u-text-14 lg:px-3 lg:py-5 lg:text-[15px]"
            >
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
