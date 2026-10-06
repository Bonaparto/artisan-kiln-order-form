'use client';

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/shared/lib/cn';
import { FieldError } from './FieldError';

/*
 * "Fill in the blank" fields from the mockup: an uppercase label followed by
 * a ruled line the customer writes on.
 */

const labelClass = 'shrink-0 whitespace-nowrap font-semibold uppercase';

interface LinedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function LinedInput({ label, error, className, id, ref, ...inputProps }: LinedInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-baseline gap-1.5">
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="lined-input"
          {...inputProps}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface LinedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
  /** Distance between ruled lines (any CSS length). */
  linePitch?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Multi-line variant: the label sits on the first ruled line and the text
 * starts right after it, continuing on full-width lines below.
 */
export function LinedTextarea({
  label,
  error,
  className,
  id,
  rows = 2,
  linePitch = '1.5em',
  ref,
  ...textareaProps
}: LinedTextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const labelRef = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = labelRef.current;
    if (!element) return;
    const measure = () => setLabelWidth(element.offsetWidth);
    measure();
    // Re-measure when the web font swaps in or the label wraps differently.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    '--lh': linePitch,
    '--label-w': labelWidth === null ? '8.5rem' : `${labelWidth + 6}px`,
  } as CSSProperties;

  return (
    <div className={cn('relative min-w-0', className)} style={style}>
      <label ref={labelRef} htmlFor={inputId} className={cn(labelClass, 'absolute top-0 left-0 leading-(--lh)')}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="lined-textarea"
        {...textareaProps}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
