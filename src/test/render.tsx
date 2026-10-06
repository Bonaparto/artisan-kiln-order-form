import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type RootState } from '@/store/store';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
}

/** Renders a component inside a fresh Redux store and returns both. */
export function renderWithStore(ui: ReactElement, { preloadedState, ...options }: Options = {}) {
  const store = makeStore(preloadedState);
  return { store, ...render(<Provider store={store}>{ui}</Provider>, options) };
}
