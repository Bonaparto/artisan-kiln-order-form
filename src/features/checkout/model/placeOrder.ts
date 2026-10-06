import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CartState } from '@/features/cart/model/cartSlice';
import { selectCartIssue, selectCartItems, selectCartTotals } from '@/features/cart/model/selectors';
import { submitOrder } from '../api/submitOrder';
import { detectCardBrand, digitsOnly } from './card';
import type { CheckoutState } from './checkoutSlice';
import { selectCheckoutErrors } from './selectors';
import { FIELD_ORDER, type CheckoutField, type OrderConfirmation } from './types';

export type PlaceOrderRejection =
  { kind: 'invalid'; fields: CheckoutField[]; cartIssue: string | null } | { kind: 'failed'; message: string };

interface CheckoutRootState {
  cart: CartState;
  checkout: CheckoutState;
}

/**
 * Validates the form and the cart, then submits the order.
 * Rejects with the invalid fields (in screen order) so the UI can focus the first one.
 */
export const placeOrder = createAsyncThunk<
  OrderConfirmation,
  void,
  { state: CheckoutRootState; rejectValue: PlaceOrderRejection }
>(
  'checkout/placeOrder',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const errors = selectCheckoutErrors(state);
    const cartIssue = selectCartIssue(state);
    const fields = FIELD_ORDER.filter((field) => errors[field]);
    if (fields.length > 0 || cartIssue) {
      return rejectWithValue({ kind: 'invalid', fields, cartIssue });
    }

    const { values, paymentMethod } = state.checkout;
    const cardDigits = digitsOnly(values.cardNumber);
    const { subtotal, shipping, grandTotal } = selectCartTotals(state);
    try {
      return await submitOrder({
        customer: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          address: values.address.trim(),
        },
        notes: values.notes.trim(),
        lines: selectCartItems(state).map(({ tileId, quantity, unitPrice }) => ({ tileId, quantity, unitPrice })),
        totals: { subtotal, shipping, grandTotal },
        payment: {
          method: paymentMethod,
          card:
            paymentMethod === 'card' ? { brand: detectCardBrand(cardDigits), last4: cardDigits.slice(-4) } : undefined,
        },
      });
    } catch (error) {
      return rejectWithValue({
        kind: 'failed',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    }
  },
  {
    condition: (_, { getState }) => getState().checkout.status !== 'submitting',
  },
);
