'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useId } from 'react';
import { TILE_IDS, TileArt, getTile, type TileId } from '@/entities/tile';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tileToolToggled } from '../model/designSlice';
import { selectTileUsage, selectTool } from '../model/selectors';
import type { DragData, DropData } from './dnd';

/** Every catalog tile: click to pick it as the brush, or drag it onto the board. */
export function DesignPalette({ dragging }: { dragging: DragData | null }) {
  const titleId = useId();
  const tool = useAppSelector(selectTool);
  const usage = useAppSelector(selectTileUsage);
  // Dropping a board tile back here takes it off the board.
  const { setNodeRef, isOver } = useDroppable({ id: 'palette', data: { target: 'palette' } satisfies DropData });
  const returning = dragging?.source === 'board';

  return (
    <div ref={setNodeRef} className="relative flex w-[132px] shrink-0 flex-col border-l-2 border-ink">
      <h3
        id={titleId}
        className="border-b-2 border-ink py-1.5 text-center text-[20px] leading-tight font-semibold uppercase"
      >
        Design palette
      </h3>
      <ul aria-labelledby={titleId} className="grid grid-cols-2 content-start gap-x-2 gap-y-2.5 px-[10px] py-3">
        {TILE_IDS.map((tileId) => (
          <li key={tileId}>
            <PaletteTile
              tileId={tileId}
              selected={tool?.kind === 'tile' && tool.tileId === tileId}
              onBoard={usage[tileId] ?? 0}
            />
          </li>
        ))}
      </ul>
      {returning && (
        <div
          className={cn(
            'absolute inset-1.5 top-[44px] flex items-center justify-center rounded-[6px] border-2 border-dashed border-ink/60 bg-cream/85 p-3 text-center text-[15px] font-semibold text-ink-soft uppercase transition-colors',
            isOver && 'border-terracotta bg-terracotta/15 text-terracotta-dark',
          )}
        >
          Drop here to take it off the board
        </div>
      )}
    </div>
  );
}

function PaletteTile({ tileId, selected, onBoard }: { tileId: TileId; selected: boolean; onBoard: number }) {
  const dispatch = useAppDispatch();
  const { name } = getTile(tileId);
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `palette-${tileId}`,
    data: { source: 'palette', tileId } satisfies DragData,
  });

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      title={name}
      aria-pressed={selected}
      aria-label={`${name}${onBoard ? `, ${onBoard} on the board` : ''}`}
      onClick={() => dispatch(tileToolToggled(tileId))}
      whileHover={{ y: -2, rotate: -2 }}
      whileTap={{ scale: 0.94 }}
      {...listeners}
      className={cn(
        'relative block size-[52px] cursor-grab touch-none rounded-[6px] select-none active:cursor-grabbing',
        selected && 'ring-[3px] ring-navy ring-offset-2 ring-offset-sand',
        isDragging && 'opacity-40',
      )}
    >
      <span className="block size-full overflow-hidden rounded-[6px] border-2 border-ink shadow-tile">
        <TileArt tileId={tileId} className="block size-full" />
      </span>
      {onBoard > 0 && (
        <span
          aria-hidden
          className="absolute -right-1.5 -bottom-1.5 min-w-[18px] rounded-full border-[1.5px] border-ink bg-cream-light px-1 text-[11px] leading-[15px] font-bold tabular-nums"
        >
          {onBoard}
        </span>
      )}
    </motion.button>
  );
}
