import type { SVGProps } from 'react';
import { leafPath } from '@/shared/lib/geometry';

/*
 * Decorative artwork for the page frame, drawn in the mockup's
 * printed-sticker style. Everything here is aria-hidden.
 */

export {
  ClayDiamondTile,
  HandCarryingTile,
  HandsHoldingTile,
  HandWithPalette,
  HandWithTile,
  KilnBuilding,
  KilnOven,
  TileSprig,
} from './traced';

type Props = SVGProps<SVGSVGElement>;
const deco = { 'aria-hidden': true, focusable: false } as const;
/** Fill class + the shared ink outline. */
const inked = (fill = '', width = 1.5) =>
  ({
    className: `${fill} stroke-ink`.trim(),
    strokeWidth: width,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }) as const;

export function WindowDots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-center u-gap-4 lg:gap-[6px] ${className ?? ''}`}>
      {['bg-terracotta', 'bg-mustard', 'bg-sage'].map((color) => (
        <span key={color} className={`u-size-10 rounded-full border-[1.5px] border-ink lg:size-[13px] ${color}`} />
      ))}
    </span>
  );
}

interface SprigProps extends Props {
  /** Leaf pairs along the stem. */
  pairs?: number;
  /** Add terracotta berries between the leaves. */
  berries?: boolean;
}

/** Upright branch with paired leaves (optionally berries) for the frame borders. */
export function Sprig({ pairs = 6, berries = false, ...props }: SprigProps) {
  const height = 26 + pairs * 18;
  const leaves = Array.from({ length: pairs }, (_, i) => {
    const y = height - 18 - i * 18;
    const size = 24 - i * 1.6;
    return { y, size };
  });
  return (
    <svg viewBox={`0 0 44 ${height}`} {...deco} {...props}>
      <path
        d={`M22 ${height}Q25 ${height / 2} 22 6`}
        fill="none"
        className="stroke-sage-dark"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {leaves.map(({ y, size }, i) => (
        <g key={i}>
          {berries && i % 2 === 1 ? (
            <>
              <path d={`M23 ${y}l-8-7M23 ${y}l8-8`} className="stroke-sage-dark" strokeWidth={1.2} />
              <ellipse cx={15} cy={y - 9} rx={3.6} ry={4.4} {...inked('fill-terracotta', 0.9)} />
              <ellipse cx={31} cy={y - 10} rx={3.6} ry={4.4} {...inked('fill-terracotta', 0.9)} />
            </>
          ) : (
            <>
              <path
                d={leafPath(size, size * 0.3)}
                transform={`translate(23 ${y}) rotate(-138)`}
                {...inked('fill-sage', 0.9)}
              />
              <path
                d={leafPath(size, size * 0.3)}
                transform={`translate(23 ${y - 4}) rotate(-42)`}
                {...inked('fill-sage', 0.9)}
              />
            </>
          )}
        </g>
      ))}
      <path d={leafPath(16, 4.6)} transform="translate(22 10) rotate(-90)" {...inked('fill-sage', 0.9)} />
    </svg>
  );
}

/** Fern frond with dense, narrow leaflets — the big fronds in the mockup corners. */
export function FernFrond({ pairs = 12, ...props }: Props & { pairs?: number }) {
  const step = 8.5;
  const height = pairs * step + 18;
  const leaflets = Array.from({ length: pairs }, (_, i) => {
    const t = i / pairs;
    return { y: height - 8 - i * step, size: 27 * (1 - t * 0.62) };
  });
  return (
    <svg viewBox={`0 0 64 ${height}`} {...deco} {...props}>
      <path
        d={`M31 ${height}Q34 ${height / 2} 32 4`}
        fill="none"
        className="stroke-sage-dark"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {leaflets.map(({ y, size }) => (
        <g key={y}>
          <path
            d={leafPath(size, size * 0.27)}
            transform={`translate(32 ${y}) rotate(-145)`}
            {...inked('fill-sage', 0.6)}
          />
          <path
            d={leafPath(size, size * 0.27)}
            transform={`translate(32 ${y - 3}) rotate(-35)`}
            {...inked('fill-sage', 0.6)}
          />
        </g>
      ))}
      <path d={leafPath(12, 2.6)} transform="translate(32 9) rotate(-90)" {...inked('fill-sage', 0.6)} />
    </svg>
  );
}

/** Wide terracotta tile with a cream "U" hanging from its top edge. */
export function UTile(props: Props) {
  return (
    <svg viewBox="0 0 66 42" {...deco} {...props}>
      <rect x="1" y="1" width="64" height="40" rx="1.5" {...inked('fill-terracotta', 2)} />
      <path d="M16 1v11a17 17 0 0 0 34 0V1" fill="none" className="stroke-cream-light" strokeWidth={7} />
    </svg>
  );
}

/** Cream tile with an eight-petal terracotta flower (bottom-right corner of the desktop mockup). */
export function FloralTile(props: Props) {
  return (
    <svg viewBox="0 0 60 60" {...deco} {...props}>
      <rect x="1" y="1" width="58" height="58" rx="1.5" {...inked('fill-cream-light', 2)} />
      <g className="fill-terracotta">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <ellipse
            key={a}
            cx={30}
            cy={i % 2 ? 15 : 12}
            rx={i % 2 ? 4 : 5.5}
            ry={i % 2 ? 7 : 10}
            transform={`rotate(${a} 30 30)`}
          />
        ))}
      </g>
      <circle cx="30" cy="30" r="5" className="fill-mustard" />
    </svg>
  );
}

/** Low fan of leaves growing from the ground line. */
export function Shrub(props: Props) {
  const angles = [-158, -130, -105, -80, -55, -28];
  return (
    <svg viewBox="0 0 64 40" {...deco} {...props}>
      {angles.map((angle, i) => (
        <path
          key={angle}
          d={leafPath(i === 2 || i === 3 ? 34 : 26, 7)}
          transform={`translate(32 39) rotate(${angle})`}
          {...inked(i % 2 ? 'fill-sage-dark' : 'fill-sage', 0.9)}
        />
      ))}
    </svg>
  );
}

/** Square tile with a cream rainbow arch. */
export function ArchTile({ tone = 'terracotta', ...props }: Props & { tone?: 'terracotta' | 'navy' }) {
  return (
    <svg viewBox="0 0 60 60" {...deco} {...props}>
      <rect
        x="1.5"
        y="1.5"
        width="57"
        height="57"
        rx="2"
        {...inked(tone === 'navy' ? 'fill-navy' : 'fill-terracotta', 2)}
      />
      <path d="M12 58.5V44a18 18 0 0 1 36 0v14.5" fill="none" className="stroke-cream-light" strokeWidth={6} />
      <path d="M21 58.5V45a9 9 0 0 1 18 0v13.5" fill="none" className="stroke-cream-light" strokeWidth={2.5} />
    </svg>
  );
}

/** Small cream tile split by a navy diagonal. */
export function TriangleTile(props: Props) {
  return (
    <svg viewBox="0 0 30 30" {...deco} {...props}>
      <rect x="1" y="1" width="28" height="28" rx="1.5" {...inked('fill-cream-light', 1.6)} />
      <path d="M4 26 26 4v22z" className="fill-navy" />
      <circle cx="9" cy="9" r="1.6" className="fill-terracotta" />
    </svg>
  );
}

/** Tile with a quarter-circle in one corner. */
export function QuarterTile({ tone = 'mustard', ...props }: Props & { tone?: 'mustard' | 'terracotta' | 'navy' }) {
  const fill = { mustard: 'fill-mustard', terracotta: 'fill-terracotta', navy: 'fill-navy' }[tone];
  return (
    <svg viewBox="0 0 30 30" {...deco} {...props}>
      <rect x="1" y="1" width="28" height="28" rx="1.5" {...inked('fill-cream-light', 1.6)} />
      <path d="M2 28V8a20 20 0 0 1 20 20z" className={fill} />
      <path d="M2 28v-8a8 8 0 0 1 8 8z" className="fill-cream-light" />
    </svg>
  );
}

/** Green tile with cream arrow-head notches (top-left corner piece). */
export function NotchTile(props: Props) {
  return (
    <svg viewBox="0 0 44 56" {...deco} {...props}>
      <rect x="1.5" y="1.5" width="41" height="53" rx="2" {...inked('fill-sage', 2)} />
      <path d="M8 10 24 28 8 46z" {...inked('fill-cream-light', 1.4)} />
      <path d="M42 14 30 28l12 14" {...inked('fill-cream-light', 1.4)} />
    </svg>
  );
}

/** Mustard glazed pot peeking in from the edge. */
export function Pot(props: Props) {
  return (
    <svg viewBox="0 0 48 44" {...deco} {...props}>
      <path
        d="M3 8h40c1 3-1 5-4 6 4 6 4 16-2 23-6 5-22 5-29-1C2 30 2 20 7 14 4 13 2 11 3 8z"
        {...inked('fill-mustard', 1.8)}
      />
      <path d="M8 14h31" {...inked('', 1.4)} />
      <path
        d="M12 24c6 3 16 3 23 0"
        fill="none"
        className="stroke-mustard-dark"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
