'use client';

import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import { selectCartIssue } from '@/features/cart/model/selectors';
import { Spinner } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { useAppSelector } from '@/store/hooks';
import {
  selectCheckoutErrors,
  selectCheckoutStatus,
  selectSubmitAttempted,
  selectSubmitError,
} from '../model/selectors';

/** Submit button plus the summary of what still blocks the order. */
export function PlaceOrderButton({ className }: { className?: string }) {
  const status = useAppSelector(selectCheckoutStatus);
  const submitAttempted = useAppSelector(selectSubmitAttempted);
  const submitError = useAppSelector(selectSubmitError);
  const cartIssue = useAppSelector(selectCartIssue);
  const errorCount = useAppSelector((state) => Object.keys(selectCheckoutErrors(state)).length);
  const invalidSubmits = useAppSelector((state) => state.checkout.invalidSubmits);
  const [scope, animate] = useAnimate<HTMLButtonElement>();
  const submitting = status === 'submitting';

  useEffect(() => {
    if (invalidSubmits > 0 && scope.current) {
      animate(scope.current, { x: [0, -8, 8, -5, 5, -2, 0] }, { duration: 0.42 });
    }
  }, [invalidSubmits, animate, scope]);

  const fieldsMessage =
    errorCount > 0
      ? `Please fix the ${errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`}.`
      : null;
  const message = submitError ?? (submitAttempted ? (cartIssue ?? fieldsMessage) : null);

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            key={message}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-center text-[14.5px] leading-snug font-medium text-terracotta-dark"
          >
            <span className="block pb-1.5">{message}</span>
          </motion.p>
        )}
      </AnimatePresence>
      <button
        ref={scope}
        type="submit"
        aria-disabled={submitting || undefined}
        className={cn(
          'flex h-[38px] w-full items-center justify-center gap-2 rounded-[6px] border-2 border-ink bg-navy text-[21px] font-semibold tracking-[0.01em] text-cream-light uppercase shadow-ink-sm transition-colors hover:bg-navy-dark active:translate-y-px active:shadow-none',
          submitting && 'cursor-progress opacity-90',
        )}
      >
        {submitting ? (
          <>
            <Spinner className="size-5" /> Placing order…
          </>
        ) : (
          'Place secure order'
        )}
      </button>
    </div>
  );
}
