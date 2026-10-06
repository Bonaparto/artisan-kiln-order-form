'use client';

import { useId } from 'react';
import { CartPanel } from '@/features/cart/ui/CartPanel';
import { FreeShippingHint } from '@/features/cart/ui/CartTotals';
import { CheckoutForm } from '@/features/checkout/ui/CheckoutForm';
import { CustomerFields, NotesField } from '@/features/checkout/ui/CustomerFields';
import { PaymentMethodsMobile } from '@/features/checkout/ui/PaymentMethods';
import { PlaceOrderButton } from '@/features/checkout/ui/PlaceOrderButton';
import { cn } from '@/shared/lib/cn';
import { HandWithTile } from './decor/Hands';

/**
 * Mobile mockup: one column, customer details first, payment and notes after
 * the cart. The design tool is desktop-only, as the brief asks.
 */
export function MobileOrderView({ className }: { className?: string }) {
  const titleId = useId();
  const cartTitleId = useId();

  return (
    <CheckoutForm
      aria-labelledby={titleId}
      className={cn(
        'relative z-10 mx-auto max-w-[46rem] px-4 pt-[clamp(14px,4vw,30px)] text-[15px] [--field-pitch:24px] sm:px-8 sm:text-[18px] sm:[--field-pitch:34px]',
        className,
      )}
    >
      <h2 id={titleId} className="sr-only">
        Checkout
      </h2>
      <CustomerFields className="gap-y-0.5 sm:gap-y-1" />

      <section id="cart" aria-labelledby={cartTitleId} className="mt-4 scroll-mt-4 sm:mt-6">
        <h2 id={cartTitleId} className="sr-only">
          Shopping cart
        </h2>
        <CartPanel
          illustration={<HandWithTile className="-mb-4 h-[40px] w-[52px] shrink-0 sm:h-[70px] sm:w-[92px]" />}
          footer={<FreeShippingHint className="mt-1.5" />}
        />
      </section>

      <PaymentMethodsMobile className="mt-5" />
      <NotesField label="Project name / notes:" rows={3} className="mt-4" />
      <PlaceOrderButton className="mt-5" />
    </CheckoutForm>
  );
}
