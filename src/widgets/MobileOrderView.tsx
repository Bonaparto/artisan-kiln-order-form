'use client';

import { useId } from 'react';
import { CartPanel } from '@/features/cart/ui/CartPanel';
import { CheckoutForm } from '@/features/checkout/ui/CheckoutForm';
import { CustomerFields, NotesField } from '@/features/checkout/ui/CustomerFields';
import { PaymentDetailsMobile, PaymentMethodsMobile } from '@/features/checkout/ui/PaymentMethods';
import { PlaceOrderButton } from '@/features/checkout/ui/PlaceOrderButton';
import { QuarterTile, Sprig, TriangleTile } from '@/shared/illustrations';
import { HandWithTile, HandsHoldingTile } from '@/shared/illustrations/hands';
import { cn } from '@/shared/lib/cn';

/**
 * Mobile mockup: one column — customer details, cart, payment method,
 * project notes — sized in mockup pixels (`u`). The design tool is
 * desktop-only, as the brief asks. The mockup has no card fields or submit
 * button, so those follow the notes, after everything the mockup shows.
 */
export function MobileOrderView({ className }: { className?: string }) {
  const titleId = useId();
  const cartTitleId = useId();

  return (
    <CheckoutForm
      aria-labelledby={titleId}
      className={cn('relative z-10 u-px-26.5 u-pt-13 u-text-13.5 [--field-pitch:calc(var(--u)*19)]', className)}
    >
      <h2 id={titleId} className="sr-only">
        Checkout
      </h2>
      <CustomerFields className="u-pr-1.5 u-pl-3" />

      <section id="cart" aria-labelledby={cartTitleId} className="u-mt-11 scroll-mt-4">
        <h2 id={cartTitleId} className="sr-only">
          Shopping cart
        </h2>
        <CartPanel illustration={<HandWithTile className="u-h-46 u-w-67.5 shrink-0" />} />
      </section>

      <PaymentMethodsMobile className="u-mt-6.5" />

      <div className="relative">
        <NotesField label="Project name / notes:" rows={2} className="u-mr-61 u-pl-5 u-text-14" />
        <div aria-hidden className="pointer-events-none">
          <TriangleTile className="absolute u-top-6 u-left-n-21 u-w-17" />
          <QuarterTile tone="terracotta" className="absolute u-top-28 u-left-n-21 u-w-17" />
          <Sprig pairs={4} className="absolute u-top-n-34 u-right-n-26 u-w-26 rotate-[16deg]" />
          <HandsHoldingTile className="absolute u-top-n-4 u-right-n-24 u-w-92" />
        </div>
      </div>

      <PaymentDetailsMobile className="u-mt-28" />
      <PlaceOrderButton className="u-mt-12" />
    </CheckoutForm>
  );
}
