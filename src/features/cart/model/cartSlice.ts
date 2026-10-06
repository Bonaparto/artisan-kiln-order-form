import { createEntityAdapter, createSlice, type EntityState, type PayloadAction } from '@reduxjs/toolkit';
import { getTile, type TileId } from '@/entities/tile';
import type { Cents } from '@/shared/lib/money';
import { orderFinished } from '@/store/actions';

export interface CartItem {
  tileId: TileId;
  /** Square feet ordered. 0 means the customer cleared the field. */
  quantity: number;
  /** Price per square foot, captured when the line was added. */
  unitPrice: Cents;
}

export const MAX_QUANTITY = 9999;
/** Step of the per-row "Add" button, in square feet. */
export const QUANTITY_STEP = 1;
/** Quantity a tile gets when it is added through "Add new tile to cart". */
export const NEW_LINE_QUANTITY = 10;

export const clampQuantity = (value: number): number =>
  Number.isFinite(value) ? Math.min(MAX_QUANTITY, Math.max(0, Math.round(value))) : 0;

const createLine = (tileId: TileId, quantity: number): CartItem => ({
  tileId,
  quantity: clampQuantity(quantity),
  unitPrice: getTile(tileId).unitPrice,
});

/** The order shown in the mockups. */
export const SAMPLE_CART: readonly CartItem[] = [
  createLine('ocean-wave', 150),
  createLine('forest-fern', 75),
  createLine('terracotta-dot', 200),
  createLine('yellow-star', 50),
];

export interface RemovedLine {
  item: CartItem;
  /** Row position the line had, so undo puts it back in place. */
  index: number;
}

export interface CartState extends EntityState<CartItem, TileId> {
  lastRemoved: RemovedLine | null;
}

export const cartAdapter = createEntityAdapter({
  selectId: (item: CartItem) => item.tileId,
});

export const createCartState = (items: readonly CartItem[] = SAMPLE_CART): CartState =>
  cartAdapter.setAll(cartAdapter.getInitialState({ lastRemoved: null }), items);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: () => createCartState(),
  reducers: {
    quantityChanged(state, action: PayloadAction<{ tileId: TileId; quantity: number }>) {
      const item = state.entities[action.payload.tileId];
      if (item) item.quantity = clampQuantity(action.payload.quantity);
    },
    quantityIncremented(state, action: PayloadAction<TileId>) {
      const item = state.entities[action.payload];
      if (item) item.quantity = clampQuantity(item.quantity + QUANTITY_STEP);
    },
    /** Adds a tile line, or tops up the quantity if the tile is already in the cart. */
    itemAdded(state, action: PayloadAction<{ tileId: TileId; quantity?: number }>) {
      const { tileId, quantity = NEW_LINE_QUANTITY } = action.payload;
      const existing = state.entities[tileId];
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + quantity);
      } else {
        cartAdapter.addOne(state, createLine(tileId, quantity));
      }
    },
    itemRemoved(state, action: PayloadAction<TileId>) {
      const index = state.ids.indexOf(action.payload);
      if (index === -1) return;
      state.lastRemoved = { item: { ...state.entities[action.payload] }, index };
      cartAdapter.removeOne(state, action.payload);
    },
    removalUndone(state) {
      const removed = state.lastRemoved;
      state.lastRemoved = null;
      if (!removed || state.entities[removed.item.tileId]) return;
      state.ids.splice(Math.min(removed.index, state.ids.length), 0, removed.item.tileId);
      state.entities[removed.item.tileId] = removed.item;
    },
    removalDismissed(state) {
      state.lastRemoved = null;
    },
    sampleCartRestored: () => createCartState(),
  },
  extraReducers: (builder) => {
    builder.addCase(orderFinished, () => createCartState([]));
  },
});

export const {
  quantityChanged,
  quantityIncremented,
  itemAdded,
  itemRemoved,
  removalUndone,
  removalDismissed,
  sampleCartRestored,
} = cartSlice.actions;
