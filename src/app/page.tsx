import { RemovalToast } from '@/features/cart/ui/RemovalToast';
import { OrderConfirmationDialog } from '@/features/checkout/ui/OrderConfirmationDialog';
import { DesktopOrderView } from '@/widgets/DesktopOrderView';
import { MobileOrderView } from '@/widgets/MobileOrderView';
import { PageFrame } from '@/widgets/PageFrame';
import { SiteFooter } from '@/widgets/SiteFooter';
import { SiteHeader } from '@/widgets/SiteHeader';
import { TopBar } from '@/widgets/TopBar';
import { MobileDecor } from '@/widgets/decor/FrameDecor';

/*
 * Both layouts share one Redux store. Each mockup gets its own markup —
 * the order of sections differs too much for CSS alone — and CSS shows the
 * one that fits the viewport, so the server HTML is right before hydration.
 */
export default function OrderPage() {
  return (
    <>
      <PageFrame>
        <TopBar />
        <main>
          <SiteHeader />
          <MobileOrderView className="lg:hidden" />
          <DesktopOrderView className="hidden lg:grid" />
        </main>
        <SiteFooter />
        <MobileDecor />
      </PageFrame>
      {/* Outside the frame: it is a size container, which would trap position: fixed. */}
      <RemovalToast />
      <OrderConfirmationDialog />
    </>
  );
}
