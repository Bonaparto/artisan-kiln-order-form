'use client';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useId, useState, type KeyboardEvent } from 'react';
import { TileArt } from '@/entities/tile';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cellCleared, tileMoved, tilePlaced, toolCleared } from '../model/designSlice';
import { selectTool } from '../model/selectors';
import { DesignGrid } from './DesignGrid';
import { DesignPalette } from './DesignPalette';
import { DesignToolbar } from './DesignToolbar';
import { describeCell, describeDrag, getDragData, getDropData, type DragData } from './dnd';

const announcements: Announcements = {
  onDragStart: ({ active }) => `Picked up ${describeDrag(getDragData(active))}.`,
  onDragOver: ({ active, over }) => {
    const drop = getDropData(over);
    const tile = describeDrag(getDragData(active));
    if (drop?.target === 'cell') return `${tile} is over ${describeCell(drop.index)}.`;
    if (drop?.target === 'palette') return `${tile} is over the palette; drop to take it off the board.`;
    return `${tile} is outside the board.`;
  },
  onDragEnd: ({ active, over }) => {
    const drag = getDragData(active);
    const drop = getDropData(over);
    if (drop?.target === 'cell') return `${describeDrag(drag)} laid on ${describeCell(drop.index)}.`;
    return drag?.source === 'board' ? `${describeDrag(drag)} taken off the board.` : 'Dropped outside the board.';
  },
  onDragCancel: ({ active }) => `Stopped dragging ${describeDrag(getDragData(active))}.`,
};

/**
 * "Visualize your order": a 7×7 board plus the design palette (desktop only).
 *
 * Pick and place: click a palette tile to make it the brush, then click
 * cells. Drag and drop: drag from the palette onto a cell, drag laid tiles
 * to move or swap them, drag them off the board (or onto the palette) to remove.
 */
export function DesignTool({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const tool = useAppSelector(selectTool);
  const [dragging, setDragging] = useState<DragData | null>(null);
  const dndId = useId();
  const titleId = useId();
  const sensors = useSensors(
    // A few pixels of travel before a drag starts, so a plain click still picks / paints.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => setDragging(getDragData(active));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging(null);
    const drag = getDragData(active);
    const drop = getDropData(over);
    if (!drag) return;
    if (drop?.target === 'cell') {
      dispatch(
        drag.source === 'palette'
          ? tilePlaced({ index: drop.index, tileId: drag.tileId })
          : tileMoved({ from: drag.index, to: drop.index }),
      );
    } else if (drag.source === 'board') {
      dispatch(cellCleared(drag.index));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tool) dispatch(toolCleared());
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <section
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className={cn('flex overflow-hidden rounded-[10px] border-2 border-ink bg-sand', className)}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b-2 border-ink px-3 pt-2.5 pb-2 text-center">
            <h2 id={titleId} className="text-[18.5px] leading-tight font-bold uppercase">
              Visualize your order:
            </h2>
            <p className="text-[15px] leading-tight font-medium">Drag and drop tiles here to create patterns.</p>
          </header>
          <DesignGrid dragging={dragging} />
          <DesignToolbar />
        </div>
        <DesignPalette dragging={dragging} />
      </section>

      <DragOverlay dropAnimation={null}>
        {dragging && (
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            animate={{ scale: 1.08, rotate: -7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="size-full cursor-grabbing overflow-hidden rounded-[5px] border-2 border-ink shadow-lift"
          >
            <TileArt tileId={dragging.tileId} className="block size-full" />
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
