'use client';

import { motion } from 'framer-motion';
import { TileArt } from '@/entities/tile';
import { AddIcon, TrashIcon } from '@/shared/icons';
import { formatMoney } from '@/shared/lib/money';
import { Bracketed } from '@/shared/ui/Bracketed';
import { useAppDispatch } from '@/store/hooks';
import { QUANTITY_STEP, quantityIncremented } from '../model/cartSlice';
import type { CartLine } from '../model/selectors';
import { QuantityInput } from './QuantityInput';

const cell = 'border-[1.5px] border-ink px-1';

interface CartRowProps {
  line: CartLine;
  autoFocus?: boolean;
  onRemove: (line: CartLine) => void;
}

export function CartRow({ line, autoFocus, onRemove }: CartRowProps) {
  const dispatch = useAppDispatch();
  const { tile } = line;

  return (
    <motion.tr
      layout="position"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32, transition: { duration: 0.2, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 520, damping: 42 }}
      className="h-[56px] sm:h-[70px] lg:h-[67px]"
    >
      <th scope="row" className={`${cell} py-0.5 font-semibold`}>
        <span className="flex flex-col items-center gap-[3px]">
          <TileArt tileId={tile.id} className="size-[34px] border-[1.5px] border-ink sm:size-[44px]" />
          <span className="text-[10.5px] leading-none uppercase sm:text-[12px] lg:text-[11.5px]">{tile.name}</span>
        </span>
      </th>
      <td className={cell}>
        <TileArt tileId={tile.id} repeat={2} className="mx-auto size-[46px] sm:size-[62px]" />
      </td>
      <td className={cell}>
        <QuantityInput tileId={tile.id} tileName={tile.name} quantity={line.quantity} autoFocus={autoFocus} />
      </td>
      <td className={cell}>
        <Bracketed className="h-[1.3em] text-[14px] font-medium tabular-nums sm:text-[17px] lg:text-[16px]">
          {formatMoney(line.unitPrice)}
        </Bracketed>
      </td>
      <td className={`${cell} px-0.5`}>
        <span className="flex items-start justify-center gap-0.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => dispatch(quantityIncremented(tile.id))}
            aria-label={`Add ${QUANTITY_STEP} sq. ft. of ${tile.name}`}
            className="group flex min-h-6 flex-col items-center gap-0.5 rounded-[3px] p-0.5"
          >
            <AddIcon className="h-[19px] w-[26px] transition-transform group-hover:-translate-y-px" />
            <span aria-hidden className="text-[9px] leading-none font-medium uppercase">
              Add
            </span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => onRemove(line)}
            data-remove-button={tile.id}
            aria-label={`Remove ${tile.name} from cart`}
            className="group flex min-h-6 flex-col items-center gap-0.5 rounded-[3px] p-0.5"
          >
            <TrashIcon className="h-[19px] w-[18px] transition-transform group-hover:-translate-y-px group-hover:-rotate-6" />
            <span aria-hidden className="text-[9px] leading-none font-medium uppercase">
              Remove
            </span>
          </motion.button>
        </span>
      </td>
    </motion.tr>
  );
}
