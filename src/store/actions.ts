import { createAction } from '@reduxjs/toolkit';

/**
 * The customer closed the order confirmation: every slice that holds
 * per-order state resets itself. Lives outside the feature slices so that
 * none of them has to import another.
 */
export const orderFinished = createAction('order/finished');
