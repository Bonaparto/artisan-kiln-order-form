import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { orderFinished } from '@/store/actions';
import { placeOrder } from './placeOrder';
import type { CheckoutField, CheckoutValues, OrderConfirmation, PaymentMethod } from './types';

export interface CheckoutState {
  values: CheckoutValues;
  paymentMethod: PaymentMethod;
  /** Fields the customer has left at least once — their errors become visible. */
  touched: Partial<Record<CheckoutField, boolean>>;
  submitAttempted: boolean;
  status: 'idle' | 'submitting' | 'succeeded';
  confirmation: OrderConfirmation | null;
  /** Message for a failed submission that is not a validation problem. */
  submitError: string | null;
  /** Bumped on every submit blocked by validation; the submit button shakes on change. */
  invalidSubmits: number;
}

const EMPTY_VALUES: CheckoutValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
};

export const createCheckoutState = (): CheckoutState => ({
  values: { ...EMPTY_VALUES },
  paymentMethod: 'card',
  touched: {},
  submitAttempted: false,
  status: 'idle',
  confirmation: null,
  submitError: null,
  invalidSubmits: 0,
});

/**
 * The checkout form lives in the store (not in local component state)
 * because the mobile and desktop layouts render it in different places;
 * both read and write the same draft, so it survives a resize.
 */
export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: createCheckoutState,
  reducers: {
    fieldChanged(state, action: PayloadAction<{ field: CheckoutField; value: string }>) {
      state.values[action.payload.field] = action.payload.value;
      state.submitError = null;
    },
    fieldBlurred(state, action: PayloadAction<CheckoutField>) {
      state.touched[action.payload] = true;
    },
    paymentMethodChanged(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'submitting';
        state.submitAttempted = true;
        state.submitError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.confirmation = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'idle';
        if (action.payload?.kind === 'invalid') state.invalidSubmits += 1;
        if (action.payload?.kind === 'failed') state.submitError = action.payload.message;
      })
      .addCase(orderFinished, () => createCheckoutState());
  },
});

export const { fieldChanged, fieldBlurred, paymentMethodChanged } = checkoutSlice.actions;
