'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TileArt, getTile } from '@/entities/tile';
import { UndoIcon } from '@/shared/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removalDismissed, removalUndone } from '../model/cartSlice';
import { selectLastRemoved } from '../model/selectors';

const TOAST_MS = 6000;

/** "Ocean Wave removed — Undo". Paused while hovered or focused so it can't vanish mid-reach. */
export function RemovalToast() {
  const dispatch = useAppDispatch();
  const lastRemoved = useAppSelector(selectLastRemoved);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!lastRemoved || paused) return;
    const timer = setTimeout(() => dispatch(removalDismissed()), TOAST_MS);
    return () => clearTimeout(timer);
  }, [lastRemoved, paused, dispatch]);

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <AnimatePresence>
        {lastRemoved && (
          <motion.div
            key={lastRemoved.item.tileId}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="pointer-events-auto flex items-center gap-3 rounded-[10px] border-2 border-ink bg-ink py-2 pr-2 pl-2.5 text-cream shadow-lift"
          >
            <TileArt tileId={lastRemoved.item.tileId} className="size-8 rounded-[3px] border border-cream/50" />
            <span className="text-[16px]">
              <strong className="font-semibold uppercase">{getTile(lastRemoved.item.tileId).name}</strong> removed from
              cart
            </span>
            <button
              type="button"
              onClick={() => dispatch(removalUndone())}
              className="flex items-center gap-1 rounded-[6px] px-2.5 py-1.5 text-[15px] font-bold text-mustard-light uppercase transition-colors hover:bg-cream/10"
            >
              <UndoIcon className="size-4" />
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
