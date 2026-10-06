import { createSelector } from '@reduxjs/toolkit';
import type { TileId } from '@/entities/tile';
import type { DesignState } from './designSlice';

interface WithDesign {
  design: DesignState;
}

export const selectCells = (state: WithDesign) => state.design.cells;
export const selectTool = (state: WithDesign) => state.design.tool;

export const selectFilledCount = createSelector([selectCells], (cells) => cells.filter(Boolean).length);

/** How many cells each tile covers on the board. */
export const selectTileUsage = createSelector([selectCells], (cells) => {
  const usage: Partial<Record<TileId, number>> = {};
  for (const cell of cells) {
    if (cell) usage[cell] = (usage[cell] ?? 0) + 1;
  }
  return usage;
});
