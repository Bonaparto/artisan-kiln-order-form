import type { SVGProps } from 'react';

/*
 * Hand-inked icon set matching the mockups: flat fills, dark outlines.
 * All icons are decorative (aria-hidden); the controls that use them carry the labels.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = { 'aria-hidden': true, focusable: false } as const;

export function CartIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 30 26"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base}
      {...props}
    >
      <path d="M1.5 2.5h4l3.4 14.2h13.4l3.2-10H7" />
      <path d="M8.2 11.8h15.6M13 6.8l.8 9.9M19.3 6.8l-.7 9.9" />
      <circle cx="11" cy="21.6" r="2" />
      <circle cx="20.5" cy="21.6" r="2" />
    </svg>
  );
}

export function AvatarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" {...base} {...props}>
      <circle cx="14" cy="14" r="12.6" className="fill-navy stroke-ink" strokeWidth={1.5} />
      <circle cx="14" cy="10.8" r="4.3" className="fill-cream-light stroke-ink" strokeWidth={1.2} />
      <path
        d="M5.8 22.4c1.5-3.7 4.6-5.7 8.2-5.7s6.7 2 8.2 5.7a12 12 0 0 1-16.4 0z"
        className="fill-cream-light stroke-ink"
        strokeWidth={1.2}
      />
    </svg>
  );
}

export function AddIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 30 22" {...base} {...props}>
      <rect x="1" y="1" width="20" height="20" rx="4" className="fill-sage stroke-ink" strokeWidth={1.5} />
      <path d="M11 6.2v9.6M6.2 11h9.6" className="stroke-cream-light" strokeWidth={2.6} strokeLinecap="round" />
      <path
        d="M22.6 11h5.4m-2.4-2.6 2.6 2.6-2.6 2.6"
        fill="none"
        className="stroke-ink"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 22 24" {...base} {...props}>
      <path d="M8 3h6" className="stroke-ink" strokeWidth={1.6} strokeLinecap="round" />
      <rect x="2" y="4.4" width="18" height="3.7" rx="1.2" className="fill-terracotta stroke-ink" strokeWidth={1.4} />
      <path
        d="M3.6 8.1h14.8l-1.3 13a1.8 1.8 0 0 1-1.8 1.6H6.7a1.8 1.8 0 0 1-1.8-1.6z"
        className="fill-terracotta stroke-ink"
        strokeWidth={1.4}
      />
      <path d="M7.5 15.1h7" className="stroke-cream-light" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

export function BankIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 40 34" {...base} {...props}>
      <path d="M20 1.8 37.5 10.6h-35z" className="fill-sage stroke-ink" strokeWidth={1.5} strokeLinejoin="round" />
      <rect x="4" y="10.6" width="32" height="3" className="fill-sage stroke-ink" strokeWidth={1.3} />
      {[6.6, 12.6, 18.6, 24.6, 30.6].map((x) => (
        <rect key={x} x={x} y="14.8" width="2.8" height="11.4" className="fill-sage stroke-ink" strokeWidth={1.1} />
      ))}
      <rect x="3" y="26.6" width="34" height="2.8" className="fill-sage stroke-ink" strokeWidth={1.3} />
      <rect x="1.5" y="29.6" width="37" height="2.8" className="fill-sage stroke-ink" strokeWidth={1.3} />
    </svg>
  );
}

export function CardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 44 30" {...base} {...props}>
      <rect x="1" y="1" width="42" height="28" rx="4" className="fill-cream-light stroke-ink" strokeWidth={1.6} />
      <rect x="1.8" y="6" width="40.4" height="5" className="fill-ink" />
      <path d="M7 17.5h14M7 22h9" className="stroke-ink" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx="30.8" cy="20.2" r="3.4" fill="none" className="stroke-ink" strokeWidth={1.3} />
      <circle cx="35.2" cy="20.2" r="3.4" fill="none" className="stroke-ink" strokeWidth={1.3} />
    </svg>
  );
}

const PAYPAL_P =
  'M8.2 1.5h7.4c4.4 0 6.7 2.6 5.9 6.7-.8 4.4-4.1 6.8-8.5 6.8h-2.4l-1.4 8.5h-5zm3.3 4.2-.8 5.2h2c2.3 0 3.6-1.2 3.9-2.9.3-1.6-.6-2.3-2.4-2.3z';

export function PayPalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 26 28" {...base} {...props}>
      <path d={PAYPAL_P} fillRule="evenodd" className="fill-brand-paypal-navy" />
      <path
        d={PAYPAL_P}
        fillRule="evenodd"
        transform="translate(2.6 3.6)"
        className="fill-brand-paypal-blue"
        opacity={0.92}
      />
    </svg>
  );
}

const APPLE =
  'M16.4 12.7c0-2.7 2.2-4 2.3-4.1-1.3-1.9-3.3-2.1-4-2.2-1.7-.2-3.3 1-4.2 1s-2.2-1-3.6-.9C5 6.5 3.3 7.6 2.4 9.2c-1.9 3.3-.5 8.3 1.4 11 .9 1.3 2 2.8 3.4 2.8 1.4-.1 1.9-.9 3.5-.9 1.7 0 2.1.9 3.6.9s2.4-1.4 3.3-2.7c1-1.5 1.5-3 1.5-3.1 0 0-2.7-1.1-2.7-4.5zM13.7 4.6c.8-.9 1.3-2.2 1.1-3.5-1.1 0-2.4.7-3.2 1.7-.7.8-1.3 2.1-1.2 3.3 1.3.1 2.5-.6 3.3-1.5z';

/** Apple Pay mark; `framed` draws the rounded button outline used on mobile. */
export function ApplePayIcon({ framed = false, ...props }: IconProps & { framed?: boolean }) {
  return (
    <svg viewBox="0 0 56 28" {...base} {...props}>
      {framed && (
        <rect x="1" y="1" width="54" height="26" rx="5" className="fill-cream-light stroke-ink" strokeWidth={1.4} />
      )}
      <path
        d={APPLE}
        className="fill-ink"
        transform={framed ? 'translate(7.5 3.4) scale(0.86)' : 'translate(2 2) scale(0.98)'}
      />
      <text
        x={framed ? 25 : 22}
        y={framed ? 20.4 : 21.2}
        className="fill-ink"
        fontSize={framed ? 15.5 : 18}
        fontWeight={500}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

export function MastercardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 30 20" {...base} {...props}>
      <circle cx="11" cy="10" r="7.5" className="fill-brand-mc-red" />
      <circle cx="19" cy="10" r="7.5" className="fill-brand-mc-orange" />
      <path d="M15 3.66a7.5 7.5 0 0 1 0 12.68 7.5 7.5 0 0 1 0-12.68z" className="fill-brand-mc-overlap" />
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
