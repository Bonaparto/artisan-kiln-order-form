import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TileId } from '@/entities/tile';

export const GRID_SIZE = 7;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE;

/** A grid cell holds a tile or is empty. Cells are stored row by row. */
export type Cell = TileId | null;

/** What a click on the grid does: lay the chosen tile, or erase. */
export type DesignTool = { kind: 'tile'; tileId: TileId } | { kind: 'eraser' };

export interface DesignState {
  cells: Cell[];
  tool: DesignTool | null;
}

const _ = null;
const W: TileId = 'ocean-wave';
const F: TileId = 'forest-fern';
const D: TileId = 'terracotta-dot';
const Y: TileId = 'yellow-star';
const S: TileId = 'sun-arc';
const I: TileId = 'indigo-arc';
const C: TileId = 'clay-compass';
const A: TileId = 'alhambra';

/** The half-finished board from the desktop mockup. */
// prettier-ignore
export const SAMPLE_PATTERN: readonly Cell[] = [
  S, I, C, C, _, _, _,
  I, D, Y, I, _, _, _,
  D, F, A, F, _, _, _,
  D, D, F, W, _, _, _,
  C, D, W, Y, _, _, _,
  W, Y, F, _, _, _, _,
  _, _, _, _, _, _, _,
];

export const createDesignState = (cells: readonly Cell[] = SAMPLE_PATTERN): DesignState => ({
  cells: [...cells],
  tool: null,
});

const inGrid = (index: number) => Number.isInteger(index) && index >= 0 && index < CELL_COUNT;

export const designSlice = createSlice({
  name: 'design',
  initialState: () => createDesignState(),
  reducers: {
    /** Picks a palette tile as the brush; picking the active one again puts it down. */
    tileToolToggled(state, action: PayloadAction<TileId>) {
      const active = state.tool?.kind === 'tile' && state.tool.tileId === action.payload;
      state.tool = active ? null : { kind: 'tile', tileId: action.payload };
    },
    eraserToggled(state) {
      state.tool = state.tool?.kind === 'eraser' ? null : { kind: 'eraser' };
    },
    toolCleared(state) {
      state.tool = null;
    },
    tilePlaced(state, action: PayloadAction<{ index: number; tileId: TileId }>) {
      const { index, tileId } = action.payload;
      if (inGrid(index)) state.cells[index] = tileId;
    },
    cellCleared(state, action: PayloadAction<number>) {
      if (inGrid(action.payload)) state.cells[action.payload] = null;
    },
    /** Applies the active tool to a cell (click / Enter on the grid). */
    cellPainted(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (!inGrid(index) || !state.tool) return;
      state.cells[index] = state.tool.kind === 'tile' ? state.tool.tileId : null;
    },
    /** Drag a laid tile onto another cell: the two cells swap. */
    tileMoved(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (!inGrid(from) || !inGrid(to) || from === to) return;
      [state.cells[from], state.cells[to]] = [state.cells[to], state.cells[from]];
    },
    emptyCellsFilled(state, action: PayloadAction<TileId>) {
      state.cells = state.cells.map((cell) => cell ?? action.payload);
    },
    gridCleared(state) {
      state.cells = Array<Cell>(CELL_COUNT).fill(null);
    },
  },
});

export const {
  tileToolToggled,
  eraserToggled,
  toolCleared,
  tilePlaced,
  cellCleared,
  cellPainted,
  tileMoved,
  emptyCellsFilled,
  gridCleared,
} = designSlice.actions;
