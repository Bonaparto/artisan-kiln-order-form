import { createSelector } from '@reduxjs/toolkit';
import type { CheckoutState } from './checkoutSlice';
import type { CheckoutErrors, CheckoutField } from './types';
import { validateCheckout } from './validation';

interface WithCheckout {
  checkout: CheckoutState;
}

export const selectCheckoutValues = (state: WithCheckout) => state.checkout.values;
export const selectFieldValue = (state: WithCheckout, field: CheckoutField) => state.checkout.values[field];
export const selectPaymentMethod = (state: WithCheckout) => state.checkout.paymentMethod;
export const selectCheckoutStatus = (state: WithCheckout) => state.checkout.status;
export const selectConfirmation = (state: WithCheckout) => state.checkout.confirmation;
export const selectSubmitError = (state: WithCheckout) => state.checkout.submitError;
export const selectSubmitAttempted = (state: WithCheckout) => state.checkout.submitAttempted;

/** Every validation error, whether or not the customer has seen the field yet. */
export const selectCheckoutErrors = createSelector(
  [selectCheckoutValues, selectPaymentMethod],
  (values, method): CheckoutErrors => validateCheckout(values, method),
);

/** Errors are shown once a field was left, or after the first submit attempt. */
export const selectVisibleError = (state: WithCheckout, field: CheckoutField): string | undefined => {
  const { touched, submitAttempted } = state.checkout;
  return touched[field] || submitAttempted ? selectCheckoutErrors(state)[field] : undefined;
};
