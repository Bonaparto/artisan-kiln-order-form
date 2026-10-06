import type { ReactElement } from 'react';
import { concaveStarPath, frondLeaflets, leafPath, starPath, wavePath } from '@/shared/lib/geometry';
import type { TileId } from '../model/catalog';

/*
 * Artwork for every tile, drawn in a 100×100 viewBox after the tiles in the
 * mockups. Colours come from tailwind.config.js through `fill-*` / `stroke-*`.
 */

/** Decorative tiles that only appear next to the page title. */
export type DecorTileId = 'dot-grid' | 'delft' | 'clay-flower';
export type ArtId = TileId | DecorTileId;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const CORNERS = [
  [0, 0],
  [100, 0],
  [0, 100],
  [100, 100],
] as const;
const EDGES = [
  [50, 0],
  [100, 50],
  [50, 100],
  [0, 50],
] as const;

const Cream = () => <rect width="100" height="100" className="fill-cream-light" />;
const Ground = ({ className }: { className: string }) => <rect width="100" height="100" className={className} />;

/** Cream band with an ink outline, as on the arc tiles of the mockup board. */
const Band = ({ cx, cy, r, width = 6 }: { cx: number; cy: number; r: number; width?: number }) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-ink" strokeWidth={width + 2.6} />
    <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-cream-light" strokeWidth={width} />
  </>
);

interface FrondProps {
  x: number;
  y: number;
  angle: number;
  length: number;
  pairs: number;
  leaf: number;
}

/** A fern frond with narrow, dense leaflets. */
const Frond = ({ x, y, angle, length, pairs, leaf }: FrondProps) => {
  const { stem, leaflets } = frondLeaflets(x, y, angle, length, pairs, leaf);
  return (
    <g>
      <path d={stem} className="stroke-sage" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      {leaflets.map((l, i) => (
        <path
          key={i}
          d={leafPath(l.length, l.length * 0.3)}
          transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`}
          className="fill-sage"
        />
      ))}
    </g>
  );
};

/** Wavy navy bands with a thin glaze highlight. */
const Swells = ({
  ys,
  amplitude,
  period,
  width,
}: {
  ys: number[];
  amplitude: number;
  period: number;
  width: number;
}) => (
  <>
    <g fill="none" strokeLinecap="round" className="stroke-navy-dark">
      {ys.map((y) => (
        <path key={y} d={wavePath(y, amplitude, period)} strokeWidth={width} />
      ))}
    </g>
    <g fill="none" strokeLinecap="round" className="stroke-cream-light" opacity={0.9}>
      {ys.map((y) => (
        <path key={y} d={wavePath(y - width * 0.12, amplitude, period, period * 0.08)} strokeWidth={1.3} />
      ))}
    </g>
  </>
);

/** Five-petal flower used by the floral tiles. */
const Blossom = ({ x, y, r, rotate = 0 }: { x: number; y: number; r: number; rotate?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    {range(5).map((i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-r * 0.55}
        rx={r * 0.34}
        ry={r * 0.5}
        transform={`rotate(${i * 72})`}
        className="fill-terracotta"
      />
    ))}
    <circle r={r * 0.24} className="fill-mustard" />
    <path
      d={leafPath(r * 0.9, r * 0.22)}
      transform={`translate(${r * 0.6} ${r * 0.6}) rotate(40)`}
      className="fill-sage"
    />
  </g>
);

/** Chevron parquet: columns of slanted planks, alternating direction. */
const Parquet = ({ ground, line }: { ground: string; line: string }) => (
  <>
    <Ground className={ground} />
    <g className={line} strokeWidth={1.7} fill="none" strokeLinecap="square">
      {range(5).map((col) => {
        const x = col * 20;
        const up = col % 2 === 0;
        return (
          <g key={col}>
            <path d={`M${x} 0 v100`} />
            {range(14).map((row) => {
              const y = row * 10 - 20;
              return <path key={row} d={up ? `M${x} ${y + 20} L${x + 20} ${y}` : `M${x} ${y} L${x + 20} ${y + 20}`} />;
            })}
          </g>
        );
      })}
    </g>
  </>
);

/** Eight-point stars on a quincunx grid, with halves and quarters at the edges. */
const StarField = ({ outer, inner }: { outer: number; inner: number }) => (
  <g className="fill-mustard">
    {[[25, 25], [75, 25], [50, 50], [25, 75], [75, 75], ...EDGES, ...CORNERS].map(([cx, cy]) => (
      <path key={`${cx}-${cy}`} d={starPath(cx, cy, 8, outer, inner)} />
    ))}
  </g>
);

// —— the mockup order ————————————————————————————————————————————————

const oceanWave = (
  <>
    <Cream />
    <Swells ys={[13, 37, 61, 85]} amplitude={6} period={50} width={11} />
  </>
);

const forestFern = (
  <>
    <Cream />
    <Frond x={-4} y={100} angle={-47} length={110} pairs={13} leaf={30} />
    <Frond x={46} y={110} angle={-47} length={72} pairs={9} leaf={28} />
    <Frond x={-10} y={52} angle={-47} length={58} pairs={7} leaf={26} />
  </>
);

/** 3×3 dots: big corners and centre, small dots on the edges. */
const DOT_GRID: ReadonlyArray<readonly [number, number, number]> = [
  [20, 20, 13],
  [80, 20, 13],
  [20, 80, 13],
  [80, 80, 13],
  [50, 50, 16],
  [50, 19, 7.5],
  [19, 50, 7.5],
  [81, 50, 7.5],
  [50, 81, 7.5],
];

const terracottaDot = (
  <>
    <Cream />
    <g className="fill-terracotta">
      {DOT_GRID.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  </>
);

const yellowStar = (
  <>
    <Cream />
    <path d={starPath(50, 53, 7, 44, 19)} className="fill-mustard" />
  </>
);

// —— design palette ——————————————————————————————————————————————————

const rosaBloom = (
  <>
    <Cream />
    {[
      [17, 15, 0],
      [52, 11, 20],
      [86, 19, 40],
      [32, 40, 10],
      [68, 38, 50],
      [12, 66, 30],
      [48, 64, 0],
      [84, 62, 25],
      [28, 89, 45],
      [66, 88, 15],
    ].map(([x, y, rotate]) => (
      <Blossom key={`${x}-${y}`} x={x} y={y} r={9} rotate={rotate} />
    ))}
  </>
);

const azureStar = (
  <>
    <Cream />
    {CORNERS.map(([cx, cy]) => (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={42} fill="none" className="stroke-terracotta" strokeWidth={8} />
        <circle cx={cx} cy={cy} r={18} className="fill-navy" />
      </g>
    ))}
    <path d={concaveStarPath(50, 50, 31, 0.3)} className="fill-navy" />
  </>
);

const verdeLattice = (
  <>
    <Cream />
    {CORNERS.map(([cx, cy]) => (
      <rect key={`${cx}-${cy}`} x={cx - 9} y={cy - 9} width={18} height={18} className="fill-terracotta" />
    ))}
    <path
      d="M32 7h36l25 25v36L68 93H32L7 68V32z"
      fill="none"
      className="stroke-sage"
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M50 19 81 50 50 81 19 50z" fill="none" className="stroke-sage" strokeWidth={5} strokeLinejoin="round" />
    <g className="fill-terracotta">
      {[
        [50, 34],
        [66, 50],
        [50, 66],
        [34, 50],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 8} ${x + 8} ${y} ${x} ${y + 8} ${x - 8} ${y}z`} />
      ))}
    </g>
  </>
);

const saffronStar = (
  <>
    <Cream />
    <StarField outer={15} inner={6.5} />
  </>
);

const majolicaCross = (
  <>
    <Cream />
    <path d="M0 0Q50 30 100 0Q70 50 100 100Q50 70 0 100Q30 50 0 0Z" className="fill-navy" />
    {EDGES.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={9} className="fill-terracotta" />
    ))}
    <circle cx={50} cy={50} r={20} className="fill-cream-light" />
    <circle cx={50} cy={50} r={16} className="fill-terracotta" />
  </>
);

const goldenHerringbone = <Parquet ground="fill-mustard-light" line="stroke-mustard-dark" />;
const sageHerringbone = <Parquet ground="fill-sage" line="stroke-cream-light" />;

const blueSwallow = (
  <>
    <Cream />
    <g className="fill-terracotta-light">
      {[
        [76, 30, -40],
        [82, 22, -70],
        [70, 21, -110],
        [86, 36, -10],
      ].map(([x, y, a]) => (
        <path key={`${x}-${y}`} d={leafPath(15, 4)} transform={`translate(${x} ${y + 12}) rotate(${a})`} />
      ))}
    </g>
    <g className="fill-navy">
      {/* swallow: body sweeping into a forked tail */}
      <path d="M14 40c5-6 13-8 20-5 9 4 17 12 25 20l20 5-10 4 7 12-15-9c-11-3-21-8-30-15-6-5-12-8-17-12z" />
      {/* raised wing */}
      <path d="M33 39c3-12 13-22 29-27-6 9-9 18-10 30z" />
      {/* curl beneath */}
      <path d="M20 86c4-14 18-18 27-9-8-2-15 2-17 11z" />
    </g>
    <circle cx={22} cy={38} r={1.6} className="fill-cream-light" />
  </>
);

const clayMedallion = (
  <>
    <Ground className="fill-terracotta" />
    {/* cream arches reaching in from each edge, sage inside */}
    <rect x={32} y={-14} width={36} height={48} rx={18} className="fill-cream-light" />
    <rect x={32} y={66} width={36} height={48} rx={18} className="fill-cream-light" />
    <rect x={40} y={-14} width={20} height={40} rx={10} className="fill-sage" />
    <rect x={40} y={74} width={20} height={40} rx={10} className="fill-sage" />
    <rect x={-14} y={36} width={40} height={28} rx={14} className="fill-cream-light" />
    <rect x={74} y={36} width={40} height={28} rx={14} className="fill-cream-light" />
    <rect x={-14} y={42} width={33} height={16} rx={8} className="fill-sage" />
    <rect x={81} y={42} width={33} height={16} rx={8} className="fill-sage" />
  </>
);

const nightDove = (
  <>
    <Ground className="fill-navy" />
    <g className="fill-mustard-light" opacity={0.85}>
      <path d={leafPath(13, 3.5)} transform="translate(10 40) rotate(-60)" />
      <path d={leafPath(11, 3)} transform="translate(14 46) rotate(-25)" />
    </g>
    {/* dove perched, facing right */}
    <path
      d="M22 66c4-14 15-24 30-26 6-1 9-7 14-9 6-2 12 1 14 6l7 2-7 3c-2 9-8 17-17 22-10 6-24 7-36 6z"
      className="fill-cream-light"
    />
    <path d="M30 58c8-8 18-12 28-11-6 6-14 10-24 13z" className="fill-mustard" />
    <path d="M28 64c8-5 17-7 26-6" fill="none" className="stroke-mustard-dark" strokeWidth={1.6} />
    <path d="M22 66 8 72l6 2-4 6 14-8z" className="fill-cream-light" />
    <circle cx={75} cy={35} r={1.8} className="fill-navy-dark" />
    <path
      d="M50 72v10M58 71v11M46 83h16"
      fill="none"
      className="stroke-cream-light"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </>
);

// —— tiles on the sample board ———————————————————————————————————————

const sunArc = (
  <>
    <Ground className="fill-mustard" />
    <Band cx={100} cy={100} r={96} />
    <Band cx={100} cy={100} r={30} />
  </>
);

const indigoArc = (
  <>
    <Ground className="fill-navy" />
    {CORNERS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={47} fill="none" className="stroke-cream-light" strokeWidth={2.6} />
    ))}
  </>
);

const saffronCompass = (
  <>
    <Ground className="fill-mustard" />
    <path d={concaveStarPath(50, 50, 47, 0.22)} className="fill-terracotta-light stroke-cream-light" strokeWidth={3} />
    <path d={concaveStarPath(50, 50, 41, 0.22)} fill="none" className="stroke-terracotta" strokeWidth={1.2} />
  </>
);

const clayCompass = (
  <>
    <Ground className="fill-terracotta" />
    {CORNERS.map(([cx, cy]) => (
      <g key={`${cx}-${cy}`} fill="none">
        <circle cx={cx} cy={cy} r={48} className="stroke-navy" strokeWidth={4.5} />
        <circle cx={cx} cy={cy} r={42.5} className="stroke-cream-light" strokeWidth={2.2} />
      </g>
    ))}
  </>
);

const indigoCurve = (
  <>
    <Ground className="fill-navy" />
    <Band cx={100} cy={0} r={36} />
    <Band cx={0} cy={100} r={42} />
  </>
);

const snowflake = (
  <>
    <Cream />
    <g className="fill-mustard">
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M45 50V23l-8-9 6-3 7 8 7-8 6 3-8 9v27z" transform={`rotate(${a} 50 50)`} />
      ))}
      {[45, 135, 225, 315].map((a) => (
        <path key={a} d="M45.5 50 50 17l4.5 33z" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={10} />
    </g>
  </>
);

const alhambra = (
  <>
    <Cream />
    <path
      d={concaveStarPath(50, 50, 40, 0.3)}
      fill="none"
      className="stroke-sage"
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M50 33 67 50 50 67 33 50z" className="fill-sage" />
    {[45, 135, 225, 315].map((a) => (
      <path
        key={a}
        d={leafPath(15, 5)}
        transform={`rotate(${a} 50 50) translate(50 6) rotate(90)`}
        className="fill-sage"
      />
    ))}
  </>
);

// —— decorative tiles next to the title ——————————————————————————————

const dotGrid = (
  <>
    <Cream />
    <g className="fill-terracotta">
      {range(16).map((i) => (
        <circle key={i} cx={16 + (i % 4) * 22.7} cy={16 + Math.floor(i / 4) * 22.7} r={6.5} />
      ))}
    </g>
  </>
);

const delft = (
  <>
    <Cream />
    <g fill="none" className="stroke-navy" strokeWidth={3.5} strokeLinejoin="round">
      <path d="M50 10C62 26 62 38 50 50 38 38 38 26 50 10z" />
      <path d="M50 90C38 74 38 62 50 50c12 12 12 24 0 40z" />
      <path d="M10 50c16-12 28-12 40 0-12 12-24 12-40 0z" />
      <path d="M90 50C74 62 62 62 50 50c12-12 24-12 40 0z" />
    </g>
    {CORNERS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={14} className="fill-navy" />
    ))}
    <path d="M50 42 58 50 50 58 42 50z" className="fill-navy" />
  </>
);

const clayFlower = (
  <>
    <Cream />
    <g className="fill-terracotta">
      {[0, 90, 180, 270].map((a) => (
        <ellipse key={a} cx={50} cy={27} rx={10} ry={17} transform={`rotate(${a} 50 50)`} />
      ))}
      {[
        [17, 17],
        [83, 17],
        [17, 83],
        [83, 83],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6} />
      ))}
    </g>
    <circle cx={50} cy={50} r={6} className="fill-mustard" />
  </>
);

export const TILE_ART: Readonly<Record<ArtId, ReactElement>> = {
  'ocean-wave': oceanWave,
  'forest-fern': forestFern,
  'terracotta-dot': terracottaDot,
  'yellow-star': yellowStar,
  'rosa-bloom': rosaBloom,
  'azure-star': azureStar,
  'verde-lattice': verdeLattice,
  'saffron-star': saffronStar,
  'majolica-cross': majolicaCross,
  'golden-herringbone': goldenHerringbone,
  'sage-herringbone': sageHerringbone,
  'blue-swallow': blueSwallow,
  'clay-medallion': clayMedallion,
  'night-dove': nightDove,
  'sun-arc': sunArc,
  'indigo-arc': indigoArc,
  'saffron-compass': saffronCompass,
  'clay-compass': clayCompass,
  'indigo-curve': indigoCurve,
  snowflake,
  alhambra,
  'dot-grid': dotGrid,
  delft,
  'clay-flower': clayFlower,
};

// —— cart artwork: the "Tile collection" icon and the "Item" swatch ———————

const greatWave = (
  <>
    <Cream />
    <path
      d="M0 100V60c8-8 15-18 24-25 12-10 28-16 44-14 14 2 26 11 27 24 1 10-7 17-16 15-7-2-9-10-4-14-6-2-13 2-15 9-3 9 4 17 15 19 10 2 19-2 25-7v34z"
      className="fill-navy-dark"
    />
    <g fill="none" className="stroke-cream-light" strokeLinecap="round" strokeWidth={2.6}>
      <path d="M30 44c10-10 24-14 37-11" />
      <path d="M0 78c12-6 24-6 34 0s24 6 36 0 22-6 30-2" />
      <path d="M0 90c14-5 26-5 38 0s24 5 36 0 20-4 26-1" />
    </g>
    <path d="M70 22c4-3 9-3 13 0" fill="none" className="stroke-cream-light" strokeWidth={2.2} strokeLinecap="round" />
  </>
);

const fernSprig = (
  <>
    <Cream />
    <Frond x={0} y={100} angle={-47} length={120} pairs={15} leaf={38} />
    <Frond x={-12} y={38} angle={-47} length={46} pairs={6} leaf={26} />
    <Frond x={64} y={112} angle={-47} length={46} pairs={6} leaf={26} />
  </>
);

/** Icons in the cart's "Tile collection" column; other tiles use their own art. */
export const TILE_MOTIF: Partial<Readonly<Record<TileId, ReactElement>>> = {
  'ocean-wave': greatWave,
  'forest-fern': fernSprig,
};

/** Larger-scale patterns for the cart's "Item" column. */
export const TILE_SWATCH: Partial<Readonly<Record<TileId, ReactElement>>> = {
  'ocean-wave': (
    <>
      <Cream />
      <Swells ys={[8, 27, 46, 65, 84]} amplitude={7} period={64} width={10} />
    </>
  ),
  'forest-fern': (
    <>
      <Cream />
      <Frond x={-4} y={66} angle={-47} length={78} pairs={10} leaf={34} />
      <Frond x={24} y={104} angle={-47} length={104} pairs={13} leaf={36} />
      <Frond x={70} y={106} angle={-47} length={38} pairs={5} leaf={26} />
    </>
  ),
  'terracotta-dot': (
    <>
      <Cream />
      <g className="fill-terracotta">
        {[
          [10, 4, 9],
          [52, 2, 9],
          [94, 6, 9],
          [31, 25, 12],
          [74, 24, 12],
          [7, 47, 10],
          [52, 46, 12],
          [96, 47, 10],
          [30, 68, 12],
          [74, 68, 12],
          [8, 93, 10],
          [52, 95, 11],
          [96, 93, 10],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </>
  ),
  'yellow-star': (
    <>
      <Cream />
      <StarField outer={17} inner={7.5} />
    </>
  ),
};
