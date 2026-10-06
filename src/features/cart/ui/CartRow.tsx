'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { TileArt, type TileId } from '@/entities/tile';
import { AddIcon, TrashIcon } from '@/shared/icons';
import { formatMoney } from '@/shared/lib/money';
import { Bracketed } from '@/shared/ui/Bracketed';
import { useAppDispatch } from '@/store/hooks';
import { QUANTITY_STEP, quantityIncremented } from '../model/cartSlice';
import type { CartLine } from '../model/selectors';
import { QuantityInput } from './QuantityInput';

const cell = 'border-[1.5px] border-ink px-0.5';

/** Lets the page wrap a row's swatch, e.g. to make it draggable onto the design board. */
export type RenderSwatch = (tileId: TileId, swatch: ReactNode) => ReactNode;

interface CartRowProps {
  line: CartLine;
  autoFocus?: boolean;
  onRemove: (line: CartLine) => void;
  renderSwatch?: RenderSwatch;
}

export function CartRow({ line, autoFocus, onRemove, renderSwatch }: CartRowProps) {
  const dispatch = useAppDispatch();
  const { tile } = line;
  const swatch = <TileArt tileId={tile.id} variant="swatch" className="block u-size-46 lg:size-[58px]" />;

  return (
    <motion.tr
      layout="position"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32, transition: { duration: 0.2, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 520, damping: 42 }}
      className="u-h-54 lg:h-[67px]"
    >
      <th scope="row" className={`${cell} font-semibold`}>
        <span className="flex flex-col items-center u-gap-2 lg:gap-[4px]">
          <TileArt
            tileId={tile.id}
            variant="motif"
            className="u-size-35 border-[1.5px] border-ink lg:size-[43px] lg:border-2"
          />
          <span className="u-text-11.5 leading-none whitespace-nowrap uppercase lg:text-[13.5px]">{tile.name}</span>
        </span>
      </th>
      <td className={cell}>
        <span className="flex justify-center">{renderSwatch ? renderSwatch(tile.id, swatch) : swatch}</span>
      </td>
      <td className={cell}>
        <QuantityInput tileId={tile.id} tileName={tile.name} quantity={line.quantity} autoFocus={autoFocus} />
      </td>
      <td className={cell}>
        <Bracketed className="u-h-17 u-text-15.5 font-medium tabular-nums lg:h-[20px] lg:text-[18.5px]">
          {formatMoney(line.unitPrice)}
        </Bracketed>
      </td>
      <td className={cell}>
        <span className="flex items-start justify-center u-gap-2 lg:gap-[2.75px]">
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => dispatch(quantityIncremented(tile.id))}
            aria-label={`Add ${QUANTITY_STEP} sq. ft. of ${tile.name}`}
            className="group flex flex-col items-center u-gap-2.5 rounded-[3px] lg:gap-[2px]"
          >
            <AddIcon className="u-h-17.75 u-w-23.75 transition-transform group-hover:-translate-y-px lg:h-[20.5px] lg:w-[27.25px]" />
            <span
              aria-hidden
              className="u-pr-6.5 u-text-8 leading-none font-semibold uppercase lg:pr-[7px] lg:text-[11.5px]"
            >
              Add
            </span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => onRemove(line)}
            data-remove-button={tile.id}
            aria-label={`Remove ${tile.name} from cart`}
            className="group flex flex-col items-center u-gap-2.5 rounded-[3px] lg:gap-[2px]"
          >
            <TrashIcon className="u-h-19 u-w-18 transition-transform group-hover:-translate-y-px group-hover:-rotate-6 lg:h-[22.25px] lg:w-[21px]" />
            <span aria-hidden className="u-text-8 leading-none font-semibold uppercase lg:text-[11.5px]">
              Remove
            </span>
          </motion.button>
        </span>
      </td>
    </motion.tr>
  );
}
