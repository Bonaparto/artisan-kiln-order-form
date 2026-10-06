import type { SVGProps } from 'react';

/*
 * Hand-inked icon set matching the mockups: flat fills, dark outlines.
 * All icons are decorative (aria-hidden); the controls that use them carry the labels.
 * The illustrated ones are vectorised from the mockups (./traced).
 */

export {
  AddIcon,
  ApplePayButtonIcon,
  ApplePayIcon,
  AvatarIcon,
  BankIcon,
  CardIcon,
  MastercardBadge,
  PayPalIcon,
  TrashIcon,
  VisaBadge,
} from './traced';

type IconProps = SVGProps<SVGSVGElement>;

const base = { 'aria-hidden': true, focusable: false } as const;

/** Shopping cart from the top bar; the count badge is drawn by the caller over its top-right corner. */
export function CartIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 41 37"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M1.5 2.5h6.3l5 18.7-2.5 5.8h27" />
      <path d="M9.5 8.3H39l-2 12.9H12.8" />
      <circle cx="15.3" cy="32.6" r="2.6" />
      <circle cx="32" cy="32.6" r="2.6" />
    </svg>
  );
}

export function EraserIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="m3.8 15.3 9.9-9.9a2 2 0 0 1 2.8 0l3.3 3.3a2 2 0 0 1 0 2.8l-8.2 8.2H7.4z" />
      <path d="m9.2 9.9 6.1 6.1M11.6 19.7H21" />
    </svg>
  );
}

export function SweepIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M4 7h16M9.5 7V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6 7l1 12.2a1.6 1.6 0 0 0 1.6 1.5h6.8a1.6 1.6 0 0 0 1.6-1.5L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function FillIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" fill="currentColor" fillOpacity={0.25} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" fill="currentColor" fillOpacity={0.25} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" fill="currentColor" fillOpacity={0.25} />
    </svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      {...base}
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function Spinner(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...base} {...props} className={`animate-spin ${props.className ?? ''}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.3} strokeWidth={3} />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
