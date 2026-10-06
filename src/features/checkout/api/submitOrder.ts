import type { TileId } from '@/entities/tile';
import type { OrderTotals } from '@/features/cart/model/pricing';
import type { Cents } from '@/shared/lib/money';
import type { CardBrand } from '../model/card';
import type { OrderConfirmation, PaymentMethod } from '../model/types';

export interface OrderRequest {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  notes: string;
  lines: { tileId: TileId; quantity: number; unitPrice: Cents }[];
  totals: OrderTotals;
  payment: {
    method: PaymentMethod;
    /** Only the brand and last four digits ever leave the form. */
    card?: { brand: CardBrand; last4: string };
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Stand-in for the order API. The task has no backend, so this simulates
 * network latency and answers with a confirmation.
 */
export async function submitOrder(request: OrderRequest, latencyMs = 900): Promise<OrderConfirmation> {
  await wait(latencyMs);
  const orderNumber = `AK-${Date.now().toString(36).slice(-6).toUpperCase()}`;
  return {
    orderNumber,
    placedAt: new Date().toISOString(),
    customerName: request.customer.name,
    email: request.customer.email,
    total: request.totals.grandTotal,
    paymentMethod: request.payment.method,
  };
}
