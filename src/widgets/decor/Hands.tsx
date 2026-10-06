import type { SVGProps } from 'react';
import { concaveStarPath } from '@/shared/lib/geometry';

/*
 * Line-art hands from the mockups, holding tiles and a paint palette.
 * Cream fill + ink outline, the same "printed sticker" style as the icons.
 */

type Props = SVGProps<SVGSVGElement>;
const deco = { 'aria-hidden': true, focusable: false } as const;
const line = {
  className: 'fill-cream-light stroke-ink',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const;

function StarTile({ x, y, size, angle }: { x: number; y: number; size: number; angle: number }) {
  const c = size / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle} ${c} ${c})`}>
      <rect width={size} height={size} rx={2} className="fill-terracotta stroke-ink" strokeWidth={1.8} />
      <path d={concaveStarPath(c, c, c * 0.86, 0.2)} fill="none" className="stroke-navy" strokeWidth={size * 0.07} />
    </g>
  );
}

/** A hand reaching in from the left, offering a tile (next to "Add new tile to cart"). */
export function HandWithTile(props: Props) {
  return (
    <svg viewBox="0 0 96 70" {...deco} {...props}>
      {/* Fingers curled behind the tile. */}
      <path d="M44 52c4-1 9 0 12 2.5M46 46.5c4-1.5 9-1 12.5 1.5" {...line} />
      <StarTile x={43} y={6} size={46} angle={14} />
      {/* Arm, palm and the thumb pressing on the front of the tile. */}
      <path
        d="M1 50.5c9-4 17-8 25-12 4-2 8-2.5 11-1l9 4.5c2.5 1.2 3 4 1 5.6-1.8 1.4-4.3 1-6.5-.2l-4.8-2.3M1 66.5c8-1.5 15-3.5 22-6 5-2 10-2 15-.5l9 2.8c2.7.8 4.6-1.6 3.4-3.9-.8-1.6-2.6-2.6-4.4-3.1"
        {...line}
        fill="none"
      />
      <path
        d="M1 50.5c9-4 17-8 25-12 4-2 8-2.5 11-1l9 4.5c2.5 1.2 3 4 1 5.6-1.8 1.4-4.3 1-6.5-.2l-4.8-2.3 3.5 6.3c4.5 1 9 1.4 13 2.6 2.6.8 3.6 3.4 2 5.1-1 1-2.8 1.3-4.6.9l-6.6-1.6c-5-1.5-10-1.5-15 .5-7 2.5-14 4.5-22 6z"
        {...line}
      />
      <path d="M41 35.5c3.5-3.3 7.5-6.6 11.6-9.4 2.2-1.5 4.9-.8 5.6 1.4.6 1.8-.4 3.6-2 4.8l-8.2 6.3" {...line} />
    </svg>
  );
}

/** Two hands holding a tile up from the bottom edge. */
export function HandsHoldingTile(props: Props) {
  return (
    <svg viewBox="0 0 110 110" {...deco} {...props}>
      <g transform="rotate(-16 55 46)">
        <rect x="22" y="12" width="66" height="66" rx="3" className="fill-cream-light stroke-ink" strokeWidth={2} />
        <path
          d="M24 14a40 40 0 0 0 62 0M24 76a40 40 0 0 1 62 0"
          fill="none"
          className="stroke-mustard"
          strokeWidth={6}
        />
        <path d={concaveStarPath(55, 45, 22, 0.08)} className="fill-terracotta" />
        <circle cx="55" cy="45" r="5" className="fill-cream-light" />
        {[
          [24, 14],
          [86, 14],
          [24, 76],
          [86, 76],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={8} className="fill-terracotta" />
        ))}
      </g>
      {/* Left hand */}
      <path
        d="M8 110c1-14 3-24 8-31l7-10c2-2.6 5.6-2 6.3.8.4 1.6-.2 3.3-1.2 4.8L24 81l7-4.8c2.4-1.6 5.4-.4 5.7 2.2.2 1.6-.7 3.2-2.1 4.2l-6 4.4c4 0 7 2 8 6 1.4 6-2 13-4 17"
        {...line}
      />
      <path d="M17 73.5c2-4 4.5-8 7.3-11.2 1.8-2 4.8-1.6 5.7.6.6 1.4.2 3-.8 4.2" {...line} fill="none" />
      {/* Right hand */}
      <path
        d="M102 110c-1-14-3-24-8-31l-7-10c-2-2.6-5.6-2-6.3.8-.4 1.6.2 3.3 1.2 4.8L86 81l-7-4.8c-2.4-1.6-5.4-.4-5.7 2.2-.2 1.6.7 3.2 2.1 4.2l6 4.4c-4 0-7 2-8 6-1.4 6 2 13 4 17"
        {...line}
      />
      <path d="M93 73.5c-2-4-4.5-8-7.3-11.2-1.8-2-4.8-1.6-5.7.6-.6 1.4-.2 3 .8 4.2" {...line} fill="none" />
    </svg>
  );
}

/** A hand holding a painter's palette (bottom right of the desktop frame). */
export function HandWithPalette(props: Props) {
  return (
    <svg viewBox="0 0 120 112" {...deco} {...props}>
      <path
        d="M58 8c25-3 52 8 56 28 3 15-8 24-20 22-8-1.5-12 3-10 10 2.5 8-3 15-14 16-27 2.5-58-12-62-36C5 28 30 11 58 8z"
        className="fill-sand-light stroke-ink"
        strokeWidth={1.8}
      />
      <ellipse cx="85" cy="40" rx="7" ry="5.5" className="fill-cream stroke-ink" strokeWidth={1.4} />
      {[
        { cx: 34, cy: 30, cls: 'fill-terracotta' },
        { cx: 54, cy: 22, cls: 'fill-mustard' },
        { cx: 76, cy: 20, cls: 'fill-mustard-light' },
        { cx: 24, cy: 50, cls: 'fill-sage' },
        { cx: 40, cy: 66, cls: 'fill-navy' },
      ].map(({ cx, cy, cls }) => (
        <path
          key={`${cx}-${cy}`}
          d={`M${cx - 7} ${cy}c0-4.5 3.5-7 7.5-6.5 4.5.5 7 4 6 7.5-1 4-5 6-8.5 5.5-3-.5-5-3-5-6.5z`}
          className={`${cls} stroke-ink`}
          strokeWidth={1.2}
        />
      ))}
      {/* Thumb through the hole, fingers underneath. */}
      <path d="M78 112c-1-10 0-20 4-28l4-9c1.4-3 5-3.6 6.6-1.2 1 1.4 1 3.3.3 4.8l-3.4 7.4" {...line} fill="none" />
      <path d="M86 46c-3 5-4.5 10-3.6 15.5.4 2.4 2.6 3.8 4.8 3 1.6-.6 2.6-2.2 2.6-4l.2-8.5" {...line} />
      <path
        d="M102 112c1-10 0-17-2-23-1.6-4.6-1.4-9.6.6-14 1-2.4-.4-5-3-5.4-2-.3-3.8 1-4.6 2.8L90 78"
        {...line}
        fill="none"
      />
    </svg>
  );
}
