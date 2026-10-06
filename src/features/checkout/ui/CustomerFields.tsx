'use client';

import { cn } from '@/shared/lib/cn';
import { LinedInput, LinedTextarea } from '@/shared/ui/LinedField';
import { NOTES_MAX_LENGTH } from '../model/validation';
import { useCheckoutField } from './useCheckoutField';

/** Name, phone + email, and the shipping address (one ruled line on desktop, two on mobile). */
export function CustomerFields({ addressLines = 2, className }: { addressLines?: 1 | 2; className?: string }) {
  const name = useCheckoutField('name');
  const phone = useCheckoutField('phone', (raw) => raw.replace(/[^\d+()\s-]/g, ''));
  const email = useCheckoutField('email');
  const address = useCheckoutField('address');

  return (
    <div className={cn('flex flex-col', className)}>
      <LinedInput label="Customer name:" autoComplete="name" error={name.error} {...name.inputProps} />
      <div className="flex gap-x-4">
        <LinedInput
          label="Phone:"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          error={phone.error}
          className="flex-[1.12]"
          {...phone.inputProps}
        />
        <LinedInput
          label="Email:"
          type="email"
          autoComplete="email"
          spellCheck={false}
          error={email.error}
          className="flex-1"
          {...email.inputProps}
        />
      </div>
      {addressLines === 1 ? (
        <LinedInput
          label="Shipping address:"
          autoComplete="street-address"
          error={address.error}
          {...address.inputProps}
        />
      ) : (
        <LinedTextarea
          label="Shipping address:"
          rows={2}
          autoComplete="street-address"
          linePitch="var(--field-pitch)"
          error={address.error}
          {...address.inputProps}
        />
      )}
    </div>
  );
}

export function NotesField({ label, rows, className }: { label: string; rows: number; className?: string }) {
  const notes = useCheckoutField('notes');
  return (
    <LinedTextarea
      label={label}
      rows={rows}
      maxLength={NOTES_MAX_LENGTH}
      linePitch="var(--field-pitch)"
      error={notes.error}
      className={className}
      {...notes.inputProps}
    />
  );
}
