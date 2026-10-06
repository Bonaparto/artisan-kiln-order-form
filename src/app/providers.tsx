'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { StoreProvider } from '@/store/StoreProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      {/* Honour the OS "reduce motion" setting for every framer-motion animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </StoreProvider>
  );
}
