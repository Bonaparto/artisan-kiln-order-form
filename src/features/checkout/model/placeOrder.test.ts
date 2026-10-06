import { beforeEach, describe, expect, it, vi } from 'vitest';
import { itemRemoved } from '@/features/cart/model/cartSlice';
import { selectCartItems } from '@/features/cart/model/selectors';
import { dollars } from '@/shared/lib/money';
import { orderFinished } from '@/store/actions';
import { makeStore } from '@/store/store';
import { submitOrder } from '../api/submitOrder';
import { fieldChanged, paymentMethodChanged } from './checkoutSlice';
import { placeOrder } from './placeOrder';
import type { CheckoutValues } from './types';

vi.mock('../api/submitOrder', () => ({
  submitOrder: vi.fn(),
}));

const submitOrderMock = vi.mocked(submitOrder);

const fill = (store: ReturnType<typeof makeStore>, values: Partial<CheckoutValues>) => {
  for (const [field, value] of Object.entries(values)) {
    store.dispatch(fieldChanged({ field: field as keyof CheckoutValues, value }));
  }
};

const CUSTOMER: Partial<CheckoutValues> = {
  name: 'Amelia Smith',
  phone: '+1 555 012 3456',
  email: 'amelia@artisankiln.com',
  address: '12 Pottery Lane, Santa Fe',
};

const CARD: Partial<CheckoutValues> = {
  cardNumber: '4242 4242 4242 4242',
  cardExpiry: '12 / 40',
  cardCvv: '123',
};

beforeEach(() => {
  submitOrderMock.mockReset();
  submitOrderMock.mockImplementation(async (request) => ({
    orderNumber: 'AK-TEST01',
    placedAt: '2026-10-06T12:00:00.000Z',
    customerName: request.customer.name,
    email: request.customer.email,
    total: request.totals.grandTotal,
    paymentMethod: request.payment.method,
  }));
});

describe('placeOrder', () => {
  it('blocks an incomplete form and reports the invalid fields in screen order', async () => {
    const store = makeStore();
    fill(store, { email: 'amelia@artisankiln.com' });

    const result = await store.dispatch(placeOrder());

    expect(placeOrder.rejected.match(result)).toBe(true);
    expect(result.payload).toEqual({
      kind: 'invalid',
      fields: ['name', 'phone', 'address', 'cardNumber', 'cardExpiry', 'cardCvv'],
      cartIssue: null,
    });
    expect(submitOrderMock).not.toHaveBeenCalled();
    expect(store.getState().checkout).toMatchObject({ status: 'idle', submitAttempted: true, invalidSubmits: 1 });
  });

  it('blocks an empty cart even when the form is valid', async () => {
    const store = makeStore();
    fill(store, { ...CUSTOMER, ...CARD });
    for (const id of selectCartItems(store.getState()).map((item) => item.tileId)) {
      store.dispatch(itemRemoved(id));
    }

    const result = await store.dispatch(placeOrder());

    expect(result.payload).toMatchObject({ kind: 'invalid', fields: [], cartIssue: expect.stringMatching(/empty/) });
  });

  it('submits a valid order without leaking the full card number', async () => {
    const store = makeStore();
    fill(store, { ...CUSTOMER, ...CARD });

    const result = await store.dispatch(placeOrder());

    expect(placeOrder.fulfilled.match(result)).toBe(true);
    const request = submitOrderMock.mock.calls[0][0];
    expect(request.totals).toEqual({ subtotal: dollars(13_100), shipping: 0, grandTotal: dollars(13_100) });
    expect(request.lines).toHaveLength(4);
    expect(request.payment).toEqual({ method: 'card', card: { brand: 'visa', last4: '4242' } });
    expect(JSON.stringify(request)).not.toContain('4242424242424242');
    expect(store.getState().checkout).toMatchObject({
      status: 'succeeded',
      confirmation: { orderNumber: 'AK-TEST01', customerName: 'Amelia Smith', total: dollars(13_100) },
    });
  });

  it('does not need card details for other payment methods', async () => {
    const store = makeStore();
    fill(store, CUSTOMER);
    store.dispatch(paymentMethodChanged('bank-transfer'));

    const result = await store.dispatch(placeOrder());

    expect(placeOrder.fulfilled.match(result)).toBe(true);
    expect(submitOrderMock.mock.calls[0][0].payment).toEqual({ method: 'bank-transfer', card: undefined });
  });

  it('surfaces a failed submission without losing the form', async () => {
    submitOrderMock.mockRejectedValueOnce(new Error('Kiln is offline'));
    const store = makeStore();
    fill(store, { ...CUSTOMER, ...CARD });

    await store.dispatch(placeOrder());

    expect(store.getState().checkout).toMatchObject({ status: 'idle', submitError: 'Kiln is offline' });
    expect(store.getState().checkout.values.name).toBe('Amelia Smith');
  });

  it('finishing the order resets the form and empties the cart', async () => {
    const store = makeStore();
    fill(store, { ...CUSTOMER, ...CARD });
    await store.dispatch(placeOrder());

    store.dispatch(orderFinished());

    expect(store.getState().checkout).toMatchObject({ status: 'idle', confirmation: null, submitAttempted: false });
    expect(store.getState().checkout.values.name).toBe('');
    expect(selectCartItems(store.getState())).toEqual([]);
  });
});
