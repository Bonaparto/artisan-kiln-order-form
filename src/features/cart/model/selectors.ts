import { createSelector } from '@reduxjs/toolkit';
import { TILE_IDS, getTile, type Tile } from '@/entities/tile';
import { cartAdapter, type CartItem, type CartState } from './cartSlice';
import { calculateLineTotal, calculateTotals } from './pricing';

/** Selectors only need the slice they read, which keeps features decoupled from the root store type. */
interface WithCart {
  cart: CartState;
}

const adapterSelectors = cartAdapter.getSelectors((state: WithCart) => state.cart);

export const selectCartItems = adapterSelectors.selectAll;
export const selectCartLineCount = adapterSelectors.selectTotal;
export const selectLastRemoved = (state: WithCart) => state.cart.lastRemoved;

export interface CartLine extends CartItem {
  tile: Tile;
  lineTotal: number;
}

export const selectCartLines = createSelector([selectCartItems], (items): CartLine[] =>
  items.map((item) => ({ ...item, tile: getTile(item.tileId), lineTotal: calculateLineTotal(item) })),
);

export const selectCartTotals = createSelector([selectCartItems], calculateTotals);

/** Catalog tiles that are not in the cart yet — the options of "Add new tile to cart". */
export const selectTilesNotInCart = createSelector([adapterSelectors.selectEntities], (entities): Tile[] =>
  TILE_IDS.filter((id) => !entities[id]).map(getTile),
);

/** Blocks checkout: an empty cart or a line without a quantity. */
export const selectCartIssue = createSelector([selectCartLines], (lines): string | null => {
  if (lines.length === 0) return 'Your cart is empty — add at least one tile.';
  const missing = lines.find((line) => line.quantity <= 0);
  return missing ? `Enter a quantity for ${missing.tile.name}.` : null;
});
