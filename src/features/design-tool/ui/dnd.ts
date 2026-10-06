import { useDndContext, type Active, type Over } from '@dnd-kit/core';
import { getTile, type TileId } from '@/entities/tile';
import { GRID_SIZE } from '../model/designSlice';

/**
 * What is being dragged: a fresh tile (from the palette or from a cart row),
 * or one already laid on the board.
 */
export type DragData =
  { source: 'palette' | 'cart'; tileId: TileId } | { source: 'board'; tileId: TileId; index: number };

/** Where it can be dropped: a board cell, or back onto the palette (= take it off the board). */
export type DropData = { target: 'cell'; index: number } | { target: 'palette' };

export const getDragData = (active: Active | null): DragData | null =>
  (active?.data.current as DragData | undefined) ?? null;

export const getDropData = (over: Over | null): DropData | null => (over?.data.current as DropData | undefined) ?? null;

/** The tile currently being dragged, if any (inside DesignBoardProvider). */
export const useDragging = (): DragData | null => getDragData(useDndContext().active);

export const cellPosition = (index: number) => ({
  row: Math.floor(index / GRID_SIZE) + 1,
  column: (index % GRID_SIZE) + 1,
});

export const describeCell = (index: number) => {
  const { row, column } = cellPosition(index);
  return `row ${row}, column ${column}`;
};

export const describeDrag = (data: DragData | null) => (data ? getTile(data.tileId).name : 'Tile');
