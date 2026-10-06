'use client';

import { motion } from 'framer-motion';
import { useId, useState, type Ref } from 'react';
import { TileArt, type TileId } from '@/entities/tile';
import { CloseIcon } from '@/shared/icons';
import { ClayDiamondTile } from '@/shared/illustrations';
import { cn } from '@/shared/lib/cn';
import { formatMoney } from '@/shared/lib/money';
import { Dialog } from '@/shared/ui/Dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NEW_LINE_QUANTITY, itemAdded } from '../model/cartSlice';
import { selectTilesNotInCart } from '../model/selectors';

interface AddTileButtonProps {
  onAdded?: (tileId: TileId) => void;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

/** "Add new tile to cart" plus the picker of catalog tiles that are not in the cart yet. */
export function AddTileButton({ onAdded, className, ref }: AddTileButtonProps) {
  const dispatch = useAppDispatch();
  const available = useAppSelector(selectTilesNotInCart);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const hintId = useId();

  const add = (tileId: TileId) => {
    dispatch(itemAdded({ tileId }));
    setOpen(false);
    onAdded?.(tileId);
  };

  const allInCart = available.length === 0;

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        whileTap={allInCart ? undefined : { scale: 0.97 }}
        onClick={() => setOpen(true)}
        disabled={allInCart}
        title={allInCart ? 'Every tile in the catalog is already in your cart' : undefined}
        aria-haspopup="dialog"
        className={cn(
          'flex u-h-25.5 shrink-0 items-center u-gap-4 rounded-[4px] border-[1.5px] border-ink bg-sand-dark/60 u-pr-6 u-pl-5 transition-colors hover:bg-sand-dark disabled:cursor-not-allowed disabled:opacity-50 lg:h-[31px] lg:gap-[5px] lg:pr-[8px] lg:pl-[7px]',
          className,
        )}
      >
        <span aria-hidden className="u-text-16 leading-none font-semibold lg:text-[21px]">
          +
        </span>
        <ClayDiamondTile className="u-mr-1 u-size-18 shrink-0 lg:mr-[2px] lg:size-[21px]" />
        <span className="text-left u-text-11.5 leading-[0.92] font-semibold whitespace-nowrap uppercase lg:text-[15px]">
          Add new tile
          <br />
          to cart
        </span>
      </motion.button>

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy={titleId} describedBy={hintId}>
        <div className="rounded-[14px] border-2 border-ink bg-cream p-4 shadow-lift sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-[24px] leading-tight font-bold uppercase">
              Add a tile to your cart
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-m-1 rounded-full p-1.5 transition-colors hover:bg-sand"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <p id={hintId} className="mt-1 text-[15px] text-ink-muted">
            Priced per square foot. New lines start at {NEW_LINE_QUANTITY} sq. ft. — adjust it in the cart.
          </p>
          <ul className="mt-4 grid max-h-[60dvh] grid-cols-2 gap-2.5 overflow-y-auto p-0.5 sm:grid-cols-3">
            {available.map((tile) => (
              <li key={tile.id}>
                <button
                  type="button"
                  onClick={() => add(tile.id)}
                  className="group flex w-full flex-col items-center gap-1.5 rounded-[8px] border-[1.5px] border-ink bg-cream-light p-2.5 text-center transition-colors hover:bg-sand"
                >
                  <TileArt
                    tileId={tile.id}
                    className="size-16 rounded-[4px] border-[1.5px] border-ink shadow-ink-sm transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]"
                  />
                  <span className="text-[16px] leading-tight font-semibold uppercase">{tile.name}</span>
                  <span className="text-[13px] leading-tight text-ink-muted">{tile.description}</span>
                  <span className="text-[14px] font-semibold">{formatMoney(tile.unitPrice)} / sq. ft.</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </>
  );
}
