import { describe, expect, it } from 'vitest';
import { makeStore } from '@/store/store';
import {
  CELL_COUNT,
  SAMPLE_PATTERN,
  cellCleared,
  cellPainted,
  createDesignState,
  designSlice,
  emptyCellsFilled,
  eraserToggled,
  gridCleared,
  tileMoved,
  tilePlaced,
  tileToolToggled,
  toolCleared,
} from './designSlice';
import { selectFilledCount, selectTileUsage } from './selectors';

const reducer = designSlice.reducer;
const empty = () => createDesignState(Array(CELL_COUNT).fill(null));

describe('initial board', () => {
  it('is a 7×7 grid seeded with the pattern from the desktop mockup', () => {
    const state = reducer(undefined, { type: '@@init' });
    expect(state.cells).toHaveLength(49);
    expect(state.cells).toEqual(SAMPLE_PATTERN);
    expect(state.tool).toBeNull();
  });
});

describe('picking a tool', () => {
  it('selects a palette tile as the brush and toggles it off again', () => {
    let state = reducer(empty(), tileToolToggled('ocean-wave'));
    expect(state.tool).toEqual({ kind: 'tile', tileId: 'ocean-wave' });
    state = reducer(state, tileToolToggled('ocean-wave'));
    expect(state.tool).toBeNull();
  });

  it('switches straight to another tile or the eraser', () => {
    let state = reducer(empty(), tileToolToggled('ocean-wave'));
    state = reducer(state, tileToolToggled('forest-fern'));
    expect(state.tool).toEqual({ kind: 'tile', tileId: 'forest-fern' });
    state = reducer(state, eraserToggled());
    expect(state.tool).toEqual({ kind: 'eraser' });
    expect(reducer(state, toolCleared()).tool).toBeNull();
  });
});

describe('placing tiles', () => {
  it('a click with the brush lays the tile', () => {
    let state = reducer(empty(), tileToolToggled('yellow-star'));
    state = reducer(state, cellPainted(10));
    expect(state.cells[10]).toBe('yellow-star');
  });

  it('a click with the eraser lifts the tile', () => {
    let state = reducer(empty(), tilePlaced({ index: 3, tileId: 'sun-arc' }));
    state = reducer(state, eraserToggled());
    state = reducer(state, cellPainted(3));
    expect(state.cells[3]).toBeNull();
  });

  it('a click without a tool changes nothing', () => {
    const before = reducer(empty(), tilePlaced({ index: 3, tileId: 'sun-arc' }));
    expect(reducer(before, cellPainted(3))).toEqual(before);
  });

  it('drops from the palette replace whatever is in the cell', () => {
    let state = reducer(empty(), tilePlaced({ index: 0, tileId: 'sun-arc' }));
    state = reducer(state, tilePlaced({ index: 0, tileId: 'indigo-arc' }));
    expect(state.cells[0]).toBe('indigo-arc');
  });

  it('ignores cells outside the board', () => {
    const before = empty();
    expect(reducer(before, tilePlaced({ index: 49, tileId: 'sun-arc' }))).toEqual(before);
    expect(reducer(before, tilePlaced({ index: -1, tileId: 'sun-arc' }))).toEqual(before);
    expect(reducer(before, cellCleared(1.5))).toEqual(before);
  });
});

describe('moving tiles', () => {
  it('moves a tile onto an empty cell', () => {
    let state = reducer(empty(), tilePlaced({ index: 0, tileId: 'alhambra' }));
    state = reducer(state, tileMoved({ from: 0, to: 48 }));
    expect(state.cells[0]).toBeNull();
    expect(state.cells[48]).toBe('alhambra');
  });

  it('swaps two laid tiles', () => {
    let state = reducer(empty(), tilePlaced({ index: 0, tileId: 'alhambra' }));
    state = reducer(state, tilePlaced({ index: 1, tileId: 'golden-weave' }));
    state = reducer(state, tileMoved({ from: 0, to: 1 }));
    expect(state.cells.slice(0, 2)).toEqual(['golden-weave', 'alhambra']);
  });
});

describe('board-wide actions', () => {
  it('fills only the empty cells', () => {
    let state = reducer(empty(), tilePlaced({ index: 5, tileId: 'sun-arc' }));
    state = reducer(state, emptyCellsFilled('sage-chevron'));
    expect(state.cells[5]).toBe('sun-arc');
    expect(state.cells.filter((cell) => cell === 'sage-chevron')).toHaveLength(48);
  });

  it('clears the board', () => {
    const state = reducer(createDesignState(), gridCleared());
    expect(state.cells.every((cell) => cell === null)).toBe(true);
  });
});

describe('selectors', () => {
  it('count laid tiles and usage per tile', () => {
    const store = makeStore();
    expect(selectFilledCount(store.getState())).toBe(23);
    expect(selectTileUsage(store.getState())).toMatchObject({ 'terracotta-dot': 5, 'forest-fern': 4, 'sun-arc': 1 });
    store.dispatch(gridCleared());
    expect(selectFilledCount(store.getState())).toBe(0);
    expect(selectTileUsage(store.getState())).toEqual({});
  });
});
