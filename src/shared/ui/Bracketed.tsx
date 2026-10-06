import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/** Wraps content in the thin, full-height square brackets used across the mockups: [ $28.00 ]. */
export function Bracketed({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('relative inline-flex items-center justify-center px-[0.3em]', className)}>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[0.24em] border-y-[1.5px] border-l-[1.5px] border-current"
      />
      {children}
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-[0.24em] border-y-[1.5px] border-r-[1.5px] border-current"
      />
    </span>
  );
}
