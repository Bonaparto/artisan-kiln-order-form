'use client';

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { formatMoney, type Cents } from '@/shared/lib/money';

/**
 * A money amount that counts to its new value instead of jumping.
 * The text node is driven by a motion value, so ticking does not re-render React.
 */
export function AnimatedMoney({ value, className }: { value: Cents; className?: string }) {
  const amount = useMotionValue(value);
  const text = useTransform(amount, (latest) => formatMoney(Math.round(latest)));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controls = animate(amount, value, { duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [amount, value, reduceMotion]);

  return <motion.span className={className}>{text}</motion.span>;
}
