import type { ReactNode } from 'react';
import { FrameDecor } from './decor/FrameDecor';

/**
 * The rounded "browser window" every mockup is drawn in.
 *
 * Below 1024px the frame is a size container and `--u` is one pixel of the
 * 384px mobile mockup (380px inside the borders), so the whole mobile layout
 * scales with the screen — up to 2x, which is the mockup's own 768px. On
 * desktop `--u` is a plain pixel and the layout follows the 1376px mockup.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-sand-dark/45 wide:flex wide:flex-col wide:justify-center wide:p-6">
      <div className="relative mx-auto w-full max-w-[768px] overflow-hidden rounded-[16px] border-2 border-ink bg-cream paper max-lg:@container lg:max-w-[1376px] lg:rounded-frame wide:shadow-frame">
        <div className="[--u:calc(100cqw/380)] lg:[--u:1px]">
          <FrameDecor />
          {children}
        </div>
      </div>
    </div>
  );
}
