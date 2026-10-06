import type { SVGProps } from 'react';
import { concaveStarPath, wavePath } from '@/shared/lib/geometry';

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
/** Same ink, no fill — for open strokes (a class would beat a `fill` attribute). */
const stroke = { ...line, className: 'fill-none stroke-ink' } as const;

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
        {...stroke}
      />
      <path
        d="M1 50.5c9-4 17-8 25-12 4-2 8-2.5 11-1l9 4.5c2.5 1.2 3 4 1 5.6-1.8 1.4-4.3 1-6.5-.2l-4.8-2.3 3.5 6.3c4.5 1 9 1.4 13 2.6 2.6.8 3.6 3.4 2 5.1-1 1-2.8 1.3-4.6.9l-6.6-1.6c-5-1.5-10-1.5-15 .5-7 2.5-14 4.5-22 6z"
        {...line}
      />
      <path d="M41 35.5c3.5-3.3 7.5-6.6 11.6-9.4 2.2-1.5 4.9-.8 5.6 1.4.6 1.8-.4 3.6-2 4.8l-8.2 6.3" {...line} />
    </svg>
  );
}

/**
 * A hand carrying an Ocean Wave tile across the board — the drag-and-drop
 * moment drawn in the desktop mockup.
 */
export function HandCarryingTile(props: Props) {
  return (
    <svg viewBox="0 0 200 250" {...deco} {...props}>
      {/* Back of the hand and the wrist, running off to the bottom right. */}
      <path d="M112 102c22 2 44 16 58 38 13 21 21 47 27 78l3 32h-58c-3-26-10-46-22-61-11-14-26-24-34-38z" {...line} />
      <g transform="rotate(-8 48 46)">
        <rect x="4" y="4" width="88" height="84" rx="3" className="fill-cream-light stroke-ink" strokeWidth={2} />
        <svg x="6" y="6" width="84" height="80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g fill="none" strokeLinecap="round" className="stroke-navy-dark">
            {[13, 37, 61, 85].map((y) => (
              <path key={y} d={wavePath(y, 6, 50)} strokeWidth={11} />
            ))}
          </g>
          <g fill="none" strokeLinecap="round" className="stroke-cream-light">
            {[11.7, 35.7, 59.7, 83.7].map((y) => (
              <path key={y} d={wavePath(y, 6, 50, 4)} strokeWidth={1.3} />
            ))}
          </g>
        </svg>
      </g>
      {/* Curled fingers gripping the bottom edge. */}
      <path d="M60 96c14-5 36-3 54 4 8 3 9 12 2 14-16-2-34-4-50-4-9 0-13-11-6-14z" {...line} />
      <path d="M70 114c14-1 30 2 42 7 7 3 6 12-1 13-13-1-27-4-38-7-8-2-9-12-3-13z" {...line} />
      <path d="M80 131c12 1 24 5 32 10 6 4 3 12-4 11-10-1-20-5-27-9-6-3-6-12-1-12z" {...line} />
      {/* Thumb pressing on the face of the tile. */}
      <path d="M126 106c-12-11-26-21-42-29-7-4-14 3-9 9 11 12 24 22 38 31z" {...line} />
      <path d="M134 150c8 10 18 15 28 16" {...stroke} />
    </svg>
  );
}

/** Two hands holding a tile up from the bottom edge. */
export function HandsHoldingTile(props: Props) {
  return (
    <svg viewBox="0 0 110 110" {...deco} {...props}>
      {/* A cream floor tile: terracotta flower, saffron rings in the corners. */}
      <g transform="rotate(-16 55 46)">
        <rect x="22" y="12" width="66" height="66" rx="3" className="fill-cream-light stroke-ink" strokeWidth={2} />
        <g fill="none" className="stroke-mustard" strokeWidth={5}>
          <path d="M22 34a22 22 0 0 0 22-22M66 12a22 22 0 0 0 22 22M88 56a22 22 0 0 0-22 22M44 78a22 22 0 0 0-22-22" />
        </g>
        <g className="fill-terracotta">
          {[0, 90, 180, 270].map((a) => (
            <ellipse key={a} cx={55} cy={33} rx={6} ry={10} transform={`rotate(${a} 55 45)`} />
          ))}
        </g>
        <circle cx="55" cy="45" r="4" className="fill-mustard" />
      </g>
      {/* Left hand */}
      <path
        d="M8 110c1-14 3-24 8-31l7-10c2-2.6 5.6-2 6.3.8.4 1.6-.2 3.3-1.2 4.8L24 81l7-4.8c2.4-1.6 5.4-.4 5.7 2.2.2 1.6-.7 3.2-2.1 4.2l-6 4.4c4 0 7 2 8 6 1.4 6-2 13-4 17"
        {...line}
      />
      <path d="M17 73.5c2-4 4.5-8 7.3-11.2 1.8-2 4.8-1.6 5.7.6.6 1.4.2 3-.8 4.2" {...stroke} />
      {/* Right hand */}
      <path
        d="M102 110c-1-14-3-24-8-31l-7-10c-2-2.6-5.6-2-6.3.8-.4 1.6.2 3.3 1.2 4.8L86 81l-7-4.8c-2.4-1.6-5.4-.4-5.7 2.2-.2 1.6.7 3.2 2.1 4.2l6 4.4c-4 0-7 2-8 6-1.4 6 2 13 4 17"
        {...line}
      />
      <path d="M93 73.5c-2-4-4.5-8-7.3-11.2-1.8-2-4.8-1.6-5.7.6-.6 1.4-.2 3 .8 4.2" {...stroke} />
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
      <path d="M78 112c-1-10 0-20 4-28l4-9c1.4-3 5-3.6 6.6-1.2 1 1.4 1 3.3.3 4.8l-3.4 7.4" {...stroke} />
      <path d="M86 46c-3 5-4.5 10-3.6 15.5.4 2.4 2.6 3.8 4.8 3 1.6-.6 2.6-2.2 2.6-4l.2-8.5" {...line} />
      <path d="M102 112c1-10 0-17-2-23-1.6-4.6-1.4-9.6.6-14 1-2.4-.4-5-3-5.4-2-.3-3.8 1-4.6 2.8L90 78" {...stroke} />
    </svg>
  );
}
