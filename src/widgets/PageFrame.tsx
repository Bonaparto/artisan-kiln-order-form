import type { ReactNode } from 'react';
import { FrameDecor } from './decor/FrameDecor';

/**
 * The rounded "browser window" every mockup is drawn in. On wide screens it
 * floats on a darker backdrop; on phones it fills the viewport.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh p-1.5 sm:p-3 lg:bg-sand-dark/45 lg:p-0 wide:flex wide:flex-col wide:justify-center wide:p-6">
      <div className="relative mx-auto w-full max-w-[1376px] overflow-hidden rounded-[16px] border-2 border-ink bg-cream paper lg:rounded-frame wide:shadow-frame">
        <FrameDecor />
        {children}
      </div>
    </div>
  );
}
