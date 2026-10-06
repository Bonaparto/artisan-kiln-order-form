import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { cartSlice } from '@/features/cart/model/cartSlice';
import { checkoutSlice } from '@/features/checkout/model/checkoutSlice';
import { designSlice } from '@/features/design-tool/model/designSlice';

export const rootReducer = combineSlices(cartSlice, designSlice, checkoutSlice);

export type RootState = ReturnType<typeof rootReducer>;

/**
 * A store per request/render tree, as recommended for the Next.js App Router:
 * a module-level singleton would be shared between users on the server.
 */
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
