'use client';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useId, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TileArt } from '@/entities/tile';
import { useAppDispatch } from '@/store/hooks';
import { cellCleared, tileMoved, tilePlaced } from '../model/designSlice';
import { describeCell, describeDrag, getDragData, getDropData, useDragging } from './dnd';

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

const subscribeNever = () => () => {};

/** The tile that follows the pointer, tilted as if held in a hand. */
function DragPreview() {
  const dragging = useDragging();
  // Portalled to <body> (client only): no ancestor transform or containment can offset it.
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return createPortal(
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
    </DragOverlay>,
    document.body,
  );
}

/**
 * Drag-and-drop for the desktop page: tiles can come from the design
 * palette or from the cart rows, and land on the board.
 */
export function DesignBoardProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const dndId = useId();
  const sensors = useSensors(
    // A few pixels of travel before a drag starts, so a plain click still picks / paints.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const drag = getDragData(active);
    const drop = getDropData(over);
    if (!drag) return;
    if (drop?.target === 'cell') {
      dispatch(
        drag.source === 'board'
          ? tileMoved({ from: drag.index, to: drop.index })
          : tilePlaced({ index: drop.index, tileId: drag.tileId }),
      );
    } else if (drag.source === 'board') {
      dispatch(cellCleared(drag.index));
    }
  };

  return (
    <DndContext id={dndId} sensors={sensors} accessibility={{ announcements }} onDragEnd={handleDragEnd}>
      {children}
      <DragPreview />
    </DndContext>
  );
}
