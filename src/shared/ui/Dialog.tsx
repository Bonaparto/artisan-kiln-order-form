'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal built on the native <dialog>: the browser provides the focus trap,
 * Esc handling, the top layer and focus restoration. Entry/exit transitions
 * live in globals.css (`.dialog`).
 */
export function Dialog({ open, onClose, labelledBy, describedBy, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn('dialog', className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClose={onClose}
      // A click that lands on the <dialog> itself (not its content) is a backdrop click.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
