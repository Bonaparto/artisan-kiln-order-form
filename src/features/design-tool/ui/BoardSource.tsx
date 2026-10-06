'use client';

import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { getTile, type TileId } from '@/entities/tile';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tileToolToggled } from '../model/designSlice';
import { selectTool } from '../model/selectors';
import type { DragData } from './dnd';

/**
 * Makes a cart row's swatch a source for the design board: drag it onto a
 * cell, or click it to paint with that tile — the tiles of the order are not
 * in the decorative palette, so this is how they reach the board.
 */
export function BoardSource({ tileId, children }: { tileId: TileId; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const tool = useAppSelector(selectTool);
  const selected = tool?.kind === 'tile' && tool.tileId === tileId;
  const { name } = getTile(tileId);
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `cart-${tileId}`,
    data: { source: 'cart', tileId } satisfies DragData,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      onClick={() => dispatch(tileToolToggled(tileId))}
      aria-pressed={selected}
      aria-label={`Paint the design board with ${name}`}
      title={`Drag ${name} onto the board, or click to paint with it`}
      className={cn(
        'block cursor-grab touch-none rounded-[2px] transition-transform select-none hover:-translate-y-px active:cursor-grabbing',
        selected && 'ring-[3px] ring-navy ring-offset-2 ring-offset-cream',
        isDragging && 'opacity-40',
      )}
    >
      {children}
    </button>
  );
}
