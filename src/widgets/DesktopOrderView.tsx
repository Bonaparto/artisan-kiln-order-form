'use client';

import { useId } from 'react';
import { CartPanel } from '@/features/cart/ui/CartPanel';
import type { RenderSwatch } from '@/features/cart/ui/CartRow';
import { CartTotals } from '@/features/cart/ui/CartTotals';
import { CheckoutForm } from '@/features/checkout/ui/CheckoutForm';
import { CustomerFields, NotesField } from '@/features/checkout/ui/CustomerFields';
import { PaymentMethodsDesktop } from '@/features/checkout/ui/PaymentMethods';
import { PlaceOrderButton } from '@/features/checkout/ui/PlaceOrderButton';
import { BoardSource } from '@/features/design-tool/ui/BoardSource';
import { DesignBoardProvider } from '@/features/design-tool/ui/DesignBoardProvider';
import { DesignTool } from '@/features/design-tool/ui/DesignTool';
import { HandWithTile } from '@/shared/illustrations';
import { cn } from '@/shared/lib/cn';

/** On desktop the tiles of the order can be dragged from the cart onto the design board. */
const boardSwatch: RenderSwatch = (tileId, swatch) => <BoardSource tileId={tileId}>{swatch}</BoardSource>;

/**
 * Desktop mockup: cart | visualizer | order summary.
 * Between lg and xl the summary drops under the first two columns.
 */
export function DesktopOrderView({ className }: { className?: string }) {
  const cartTitleId = useId();
  const summaryTitleId = useId();

  return (
    <DesignBoardProvider>
      <div
        className={cn(
          'relative z-10 grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-x-6 gap-y-8 px-[clamp(28px,calc((100%-1240px)/2),68px)] pt-[14px] xl:grid-cols-[384px_clamp(16px,2vw,28px)_minmax(0,1fr)_8px_minmax(0,308px)] xl:gap-x-0 xl:pr-[clamp(28px,calc((100%-1252px)/2),60px)]',
          className,
        )}
      >
        <section id="cart" aria-labelledby={cartTitleId} className="scroll-mt-4 xl:col-start-1">
          <h2
            id={cartTitleId}
            className="mb-[5px] text-[30.5px] leading-none font-semibold whitespace-nowrap uppercase"
          >
            Shopping cart &amp; design tool
          </h2>
          <CartPanel
            illustration={<HandWithTile className="mr-[5px] h-[57.75px] w-[79px] shrink-0" />}
            renderSwatch={boardSwatch}
          />
        </section>

        <DesignTool className="self-start xl:col-start-3 xl:mt-[35px]" />

        <section aria-labelledby={summaryTitleId} className="col-span-2 xl:col-span-1 xl:col-start-5">
          <div className="flex items-end">
            <h2
              id={summaryTitleId}
              className="border-x-2 border-t-2 border-ink bg-sand px-2 pt-0.5 pb-px text-[23px] leading-tight font-bold whitespace-nowrap uppercase"
            >
              Order summary
            </h2>
            <span aria-hidden className="flex-1 border-b-2 border-ink" />
          </div>
          <CheckoutForm
            aria-labelledby={summaryTitleId}
            className="grid gap-x-10 pt-1.5 text-[15.5px] [--field-pitch:20px] lg:grid-cols-2 xl:block"
          >
            <div className="xl:pl-[11px]">
              <CustomerFields addressLines={1} className="gap-y-px" />
              <NotesField label="Project notes:" rows={2} className="mt-px [--field-pitch:21px]" />
              <CartTotals variant="inline" className="mt-2.5" />
            </div>
            <div className="xl:pr-3 xl:pl-[19px]">
              <PaymentMethodsDesktop className="mt-2" />
              <PlaceOrderButton className="mt-2.5" />
            </div>
          </CheckoutForm>
        </section>
      </div>
    </DesignBoardProvider>
  );
}
