import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithStore } from '@/test/render';
import { CheckoutForm } from './CheckoutForm';
import { CustomerFields } from './CustomerFields';
import { PaymentMethodsDesktop } from './PaymentMethods';
import { PlaceOrderButton } from './PlaceOrderButton';

function Checkout() {
  return (
    <CheckoutForm>
      <CustomerFields />
      <PaymentMethodsDesktop />
      <PlaceOrderButton />
    </CheckoutForm>
  );
}

describe('checkout form', () => {
  it('shows every error and focuses the first invalid field on submit', async () => {
    const user = userEvent.setup();
    renderWithStore(<Checkout />);

    await user.click(screen.getByRole('button', { name: /place secure order/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Please fix the 7 highlighted fields.');
    expect(screen.getByRole('textbox', { name: 'Customer name:' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Customer name:' })).toHaveAccessibleDescription(
      'Enter the customer name',
    );
    expect(screen.getByRole('textbox', { name: 'Card number' })).toBeInvalid();
  });

  it('validates a field when the customer leaves it', async () => {
    const user = userEvent.setup();
    renderWithStore(<Checkout />);
    const email = screen.getByRole('textbox', { name: 'Email:' });

    await user.type(email, 'amelia@kiln');
    expect(email).toBeValid();
    await user.tab();

    expect(email).toBeInvalid();
    expect(email).toHaveAccessibleDescription('Enter a valid email, e.g. name@example.com');
  });

  it('formats the card number and expiry while typing and lights up the brand', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Checkout />);

    await user.type(screen.getByRole('textbox', { name: 'Card number' }), '5555555555554444');
    await user.type(screen.getByRole('textbox', { name: 'Expiration date, MM / YY' }), '1230');

    expect(screen.getByRole('textbox', { name: 'Card number' })).toHaveValue('5555 5555 5555 4444');
    expect(screen.getByRole('textbox', { name: 'Expiration date, MM / YY' })).toHaveValue('12 / 30');
    expect(store.getState().checkout.values.cardNumber).toBe('5555 5555 5555 4444');
  });

  it('hides the card fields for other payment methods', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<Checkout />);

    await user.click(screen.getByRole('radio', { name: /paypal/i }));

    expect(store.getState().checkout.paymentMethod).toBe('paypal');
    expect(await screen.findByText(/hand you over to PayPal/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Card number' })).not.toBeInTheDocument();
  });
});
