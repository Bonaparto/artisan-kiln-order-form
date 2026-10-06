import { describe, expect, it } from 'vitest';
import { TILE_IDS } from '@/entities/tile';
import { dollars } from '@/shared/lib/money';
import { orderFinished } from '@/store/actions';
import { makeStore } from '@/store/store';
import {
  MAX_QUANTITY,
  NEW_LINE_QUANTITY,
  QUANTITY_STEP,
  cartSlice,
  clampQuantity,
  createCartState,
  itemAdded,
  itemRemoved,
  quantityChanged,
  quantityIncremented,
  removalDismissed,
  removalUndone,
  sampleCartRestored,
} from './cartSlice';
import {
  selectCartIssue,
  selectCartItems,
  selectCartLineCount,
  selectCartTotals,
  selectTilesNotInCart,
} from './selectors';

const reducer = cartSlice.reducer;
const items = (state: ReturnType<typeof reducer>) => state.ids.map((id) => state.entities[id]);

describe('initial cart', () => {
  it('starts with the four tiles from the mockup', () => {
    const state = reducer(undefined, { type: '@@init' });
    expect(items(state)).toEqual([
      { tileId: 'ocean-wave', quantity: 150, unitPrice: dollars(28) },
      { tileId: 'forest-fern', quantity: 75, unitPrice: dollars(30) },
      { tileId: 'terracotta-dot', quantity: 200, unitPrice: dollars(26) },
      { tileId: 'yellow-star', quantity: 50, unitPrice: dollars(29) },
    ]);
    expect(state.lastRemoved).toBeNull();
  });
});

describe('clampQuantity', () => {
  it.each([
    [12, 12],
    [-3, 0],
    [12.6, 13],
    [MAX_QUANTITY + 1, MAX_QUANTITY],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])('%s → %s', (input, expected) => {
    expect(clampQuantity(input)).toBe(expected);
  });
});

describe('quantity changes', () => {
  it('sets the quantity of one line', () => {
    const state = reducer(createCartState(), quantityChanged({ tileId: 'ocean-wave', quantity: 10 }));
    expect(state.entities['ocean-wave'].quantity).toBe(10);
    expect(state.entities['forest-fern'].quantity).toBe(75);
  });

  it('clamps out-of-range input', () => {
    let state = reducer(createCartState(), quantityChanged({ tileId: 'ocean-wave', quantity: -5 }));
    expect(state.entities['ocean-wave'].quantity).toBe(0);
    state = reducer(state, quantityChanged({ tileId: 'ocean-wave', quantity: 1_000_000 }));
    expect(state.entities['ocean-wave'].quantity).toBe(MAX_QUANTITY);
  });

  it('ignores tiles that are not in the cart', () => {
    const before = createCartState();
    expect(reducer(before, quantityChanged({ tileId: 'sun-arc', quantity: 5 }))).toEqual(before);
  });

  it('"Add" bumps the quantity by one step', () => {
    const state = reducer(createCartState(), quantityIncremented('yellow-star'));
    expect(state.entities['yellow-star'].quantity).toBe(50 + QUANTITY_STEP);
  });
});

describe('adding tiles', () => {
  it('appends a new line with the catalog price', () => {
    const state = reducer(createCartState(), itemAdded({ tileId: 'azure-star' }));
    expect(state.ids.at(-1)).toBe('azure-star');
    expect(state.entities['azure-star']).toEqual({
      tileId: 'azure-star',
      quantity: NEW_LINE_QUANTITY,
      unitPrice: dollars(32),
    });
  });

  it('tops up the quantity when the tile is already in the cart', () => {
    const state = reducer(createCartState(), itemAdded({ tileId: 'ocean-wave', quantity: 5 }));
    expect(state.ids).toHaveLength(4);
    expect(state.entities['ocean-wave'].quantity).toBe(155);
  });
});

describe('removing tiles', () => {
  it('removes the line and remembers where it was', () => {
    const state = reducer(createCartState(), itemRemoved('forest-fern'));
    expect(state.ids).toEqual(['ocean-wave', 'terracotta-dot', 'yellow-star']);
    expect(state.lastRemoved).toEqual({
      item: { tileId: 'forest-fern', quantity: 75, unitPrice: dollars(30) },
      index: 1,
    });
  });

  it('undo puts the line back in its original row', () => {
    let state = reducer(createCartState(), quantityChanged({ tileId: 'forest-fern', quantity: 9 }));
    state = reducer(state, itemRemoved('forest-fern'));
    state = reducer(state, removalUndone());
    expect(state.ids).toEqual(['ocean-wave', 'forest-fern', 'terracotta-dot', 'yellow-star']);
    expect(state.entities['forest-fern'].quantity).toBe(9);
    expect(state.lastRemoved).toBeNull();
  });

  it('undo does not duplicate a tile that was re-added meanwhile', () => {
    let state = reducer(createCartState(), itemRemoved('forest-fern'));
    state = reducer(state, itemAdded({ tileId: 'forest-fern' }));
    state = reducer(state, removalUndone());
    expect(state.ids.filter((id) => id === 'forest-fern')).toHaveLength(1);
  });

  it('dismissing the toast forgets the removed line', () => {
    let state = reducer(createCartState(), itemRemoved('ocean-wave'));
    state = reducer(state, removalDismissed());
    expect(state.lastRemoved).toBeNull();
    expect(reducer(state, removalUndone()).ids).not.toContain('ocean-wave');
  });
});

describe('order lifecycle', () => {
  it('empties the cart when the order is finished, and can restore the sample', () => {
    let state = reducer(createCartState(), orderFinished());
    expect(state.ids).toEqual([]);
    state = reducer(state, sampleCartRestored());
    expect(state.ids).toHaveLength(4);
  });
});

describe('selectors', () => {
  it('derive totals from the store', () => {
    const store = makeStore();
    expect(selectCartTotals(store.getState())).toMatchObject({
      subtotal: dollars(13_100),
      shipping: 0,
      grandTotal: dollars(13_100),
    });
    store.dispatch(quantityChanged({ tileId: 'ocean-wave', quantity: 1 }));
    store.dispatch(itemRemoved('terracotta-dot'));
    store.dispatch(itemRemoved('forest-fern'));
    store.dispatch(quantityChanged({ tileId: 'yellow-star', quantity: 1 }));
    expect(selectCartTotals(store.getState())).toMatchObject({
      subtotal: dollars(57),
      shipping: dollars(25),
      grandTotal: dollars(82),
    });
    expect(selectCartLineCount(store.getState())).toBe(2);
  });

  it('memoise totals until the cart changes', () => {
    const store = makeStore();
    const first = selectCartTotals(store.getState());
    expect(selectCartTotals(store.getState())).toBe(first);
    store.dispatch(quantityIncremented('ocean-wave'));
    expect(selectCartTotals(store.getState())).not.toBe(first);
  });

  it('offer only tiles that are not in the cart yet', () => {
    const store = makeStore();
    const offered = selectTilesNotInCart(store.getState()).map((tile) => tile.id);
    expect(offered).not.toContain('ocean-wave');
    expect(offered).toContain('azure-star');
    expect(offered).toHaveLength(TILE_IDS.length - 4);
  });

  it('report what blocks checkout', () => {
    const store = makeStore();
    expect(selectCartIssue(store.getState())).toBeNull();
    store.dispatch(quantityChanged({ tileId: 'forest-fern', quantity: 0 }));
    expect(selectCartIssue(store.getState())).toBe('Enter a quantity for Forest Fern.');
    store.dispatch(orderFinished());
    expect(selectCartItems(store.getState())).toEqual([]);
    expect(selectCartIssue(store.getState())).toMatch(/cart is empty/i);
  });
});
