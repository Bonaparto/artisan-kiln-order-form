'use client';

import { useDndMonitor } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState, type KeyboardEvent } from 'react';
import { HandCarryingTile } from '@/shared/illustrations';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toolCleared } from '../model/designSlice';
import { selectTool } from '../model/selectors';
import { BoardScroller } from './BoardScroller';
import { DesignGrid } from './DesignGrid';
import { DesignPalette } from './DesignPalette';
import { BoardStatus } from './DesignToolbar';

/**
 * "Visualize your order": the 7×7 board and the design palette (desktop only).
 * Must sit inside DesignBoardProvider, which owns drag and drop.
 *
 * Pick and place: click a palette tile (or a cart swatch) to make it the
 * brush, then click cells. Drag and drop: drag a tile onto a cell, drag laid
 * tiles to move or swap them, drag them off the board to remove them.
 */
export function DesignTool({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const tool = useAppSelector(selectTool);
  const titleId = useId();
  // The hand from the mockup demonstrates dragging until the customer tries it.
  const [showHint, setShowHint] = useState(true);
  useDndMonitor({ onDragStart: () => setShowHint(false) });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tool) dispatch(toolCleared());
  };

  return (
    <section
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      onPointerDownCapture={() => setShowHint(false)}
      className={cn('relative', className)}
    >
      <div className="flex overflow-hidden rounded-[10px] border-2 border-ink bg-sand">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[75px] flex-col items-center justify-center border-b-[1.5px] border-ink px-3 text-center">
            <h2 id={titleId} className="text-[20px] leading-tight font-bold uppercase">
              Visualize your order:
            </h2>
            <p className="text-[17px] leading-tight font-medium">Drag and drop tiles here to create patterns.</p>
          </header>
          <BoardScroller>
            <DesignGrid />
          </BoardScroller>
        </div>
        <DesignPalette />
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.25 } }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 160, damping: 18 }}
            className="pointer-events-none absolute top-[57.3%] left-[44.6%] z-10 w-[37.65%]"
          >
            <HandCarryingTile className="w-full" />
          </motion.div>
        )}
      </AnimatePresence>
      <BoardStatus />
    </section>
  );
}
