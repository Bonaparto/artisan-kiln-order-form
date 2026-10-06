'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

/** Inline validation message that slides open under its field. */
export function FieldError({ id, message, className }: { id: string; message?: string; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className={cn(
            'overflow-hidden text-[12.5px] leading-4 font-medium text-terracotta-dark normal-case',
            className,
          )}
        >
          <span className="block pt-0.5">{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
