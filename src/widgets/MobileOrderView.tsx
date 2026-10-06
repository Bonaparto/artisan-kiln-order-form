'use client';

import { useId } from 'react';
import { CartPanel } from '@/features/cart/ui/CartPanel';
import { CheckoutForm } from '@/features/checkout/ui/CheckoutForm';
import { CustomerFields, NotesField } from '@/features/checkout/ui/CustomerFields';
import { PaymentDetailsMobile, PaymentMethodsMobile } from '@/features/checkout/ui/PaymentMethods';
import { PlaceOrderButton } from '@/features/checkout/ui/PlaceOrderButton';
import { HandWithTile } from '@/shared/illustrations';
import { MobileNotesDecor } from './decor/traced';
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
        <CartPanel illustration={<HandWithTile className="u-mr-4 u-h-52 u-w-71 shrink-0" />} />
      </section>

      <PaymentMethodsMobile className="u-mt-6.5" />

      <div className="relative">
        <NotesField label="Project name / notes:" rows={2} className="u-mr-1.5 u-pl-5 u-text-14" />
        <MobileNotesDecor className="pointer-events-none absolute u-top-n-0.25 u-left-n-21.5 u-w-20" />
      </div>

      <PaymentDetailsMobile className="u-mt-28" />
      {/* Room under the button for the hands in the bottom corner. */}
      <PlaceOrderButton className="u-mt-12 u-mb-16" />
    </CheckoutForm>
  );
}
