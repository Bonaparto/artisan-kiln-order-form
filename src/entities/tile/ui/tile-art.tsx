import type { ReactElement } from 'react';
import type { TileId } from '../model/catalog';
import { concaveStarPath, frondLeaflets, leafPath, starPath, wavePath, zigzagPath } from '@/shared/lib/geometry';

/*
 * Artwork for every tile, drawn in a 100×100 viewBox.
 * Colours come from tailwind.config.js through `fill-*` / `stroke-*` classes.
 */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const Fern = ({
  x,
  y,
  angle,
  length,
  pairs,
  leaf,
}: {
  x: number;
  y: number;
  angle: number;
  length: number;
  pairs: number;
  leaf: number;
}) => {
  const { stem, leaflets } = frondLeaflets(x, y, angle, length, pairs, leaf);
  return (
    <g>
      <path d={stem} className="stroke-sage" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {leaflets.map((l, i) => (
        <path
          key={i}
          d={leafPath(l.length, l.width)}
          transform={`translate(${l.x} ${l.y}) rotate(${l.angle})`}
          className="fill-sage"
        />
      ))}
    </g>
  );
};

const oceanWave = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    <g fill="none" strokeLinecap="round" className="stroke-navy-dark">
      {[16.67, 50, 83.33].map((y) => (
        <path key={y} d={wavePath(y, 6, 50)} strokeWidth={9} />
      ))}
      {[0, 33.33, 66.67, 100].map((y) => (
        <path key={y} d={wavePath(y, 6, 50)} strokeWidth={2.4} />
      ))}
    </g>
    {/* Glaze highlight running through each swell. */}
    <g fill="none" strokeLinecap="round" className="stroke-cream-light" opacity={0.85}>
      {[15.2, 48.5, 81.8].map((y) => (
        <path key={y} d={wavePath(y, 6, 50)} strokeWidth={1.3} />
      ))}
    </g>
  </>
);

const forestFern = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    <Fern x={-2} y={96} angle={-48} length={104} pairs={8} leaf={30} />
    <Fern x={52} y={108} angle={-48} length={62} pairs={5} leaf={26} />
    <Fern x={-6} y={42} angle={-48} length={44} pairs={4} leaf={22} />
  </>
);

const DOTS: ReadonlyArray<readonly [number, number, number]> = [
  [20, 20, 11],
  [80, 21, 10],
  [50, 50, 13],
  [18, 80, 10],
  [79, 80, 12],
  [50, 14, 6],
  [14, 50, 6],
  [86, 51, 7],
  [49, 86, 7],
  [34, 35, 3.5],
  [66, 34, 3.5],
  [33, 66, 3.5],
  [66, 66, 3.5],
];

const terracottaDot = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    <g className="fill-terracotta">
      {DOTS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  </>
);

const yellowStar = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    <g className="fill-mustard">
      <path d={starPath(50, 50, 8, 33, 13)} />
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([cx, cy]) => (
        <path key={`${cx}-${cy}`} d={starPath(cx, cy, 8, 20, 8)} />
      ))}
      {[
        [50, 0],
        [0, 50],
        [100, 50],
        [50, 100],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.5} />
      ))}
    </g>
  </>
);

const CORNERS = [
  [0, 0],
  [100, 0],
  [0, 100],
  [100, 100],
] as const;

const azureStar = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    {CORNERS.map(([cx, cy]) => (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={27} className="fill-terracotta" />
        <circle cx={cx} cy={cy} r={19} fill="none" className="stroke-cream-light" strokeWidth={2} />
      </g>
    ))}
    <path d={concaveStarPath(50, 50, 40, 0.13)} className="fill-navy" />
    <circle cx={50} cy={50} r={5} className="fill-cream-light" />
  </>
);

const majolicaCross = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    <path d="M0 0 Q50 34 100 0 Q66 50 100 100 Q50 66 0 100 Q34 50 0 0Z" className="fill-navy" />
    {[
      [50, 0],
      [100, 50],
      [50, 100],
      [0, 50],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={9} className="fill-terracotta" />
    ))}
    <circle cx={50} cy={50} r={15} className="fill-cream-light" />
    <circle cx={50} cy={50} r={10} className="fill-terracotta" />
  </>
);

const alhambra = (
  <>
    <rect width="100" height="100" className="fill-cream-light" />
    {CORNERS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={15} className="fill-terracotta" />
    ))}
    <path d="M50 9 L91 50 L50 91 L9 50Z" fill="none" className="stroke-sage" strokeWidth={5} strokeLinejoin="round" />
    <path d="M50 25 L75 50 L50 75 L25 50Z" className="fill-sage" />
    <path d={concaveStarPath(50, 50, 17, 0.18)} className="fill-cream-light" />
    <circle cx={50} cy={50} r={4.5} className="fill-terracotta" />
  </>
);

const goldenWeave = (
  <>
    <rect width="100" height="100" className="fill-mustard-light" />
    <g className="stroke-mustard-dark" strokeWidth={1.6} fill="none">
      {range(4).flatMap((row) =>
        range(4).map((col) => {
          const x = col * 25;
          const y = row * 25;
          const horizontal = (row + col) % 2 === 0;
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width={25} height={25} />
              {horizontal ? (
                <path d={`M${x} ${y + 8.33} h25 M${x} ${y + 16.67} h25`} />
              ) : (
                <path d={`M${x + 8.33} ${y} v25 M${x + 16.67} ${y} v25`} />
              )}
            </g>
          );
        }),
      )}
    </g>
  </>
);

const sageChevron = (
  <>
    <rect width="100" height="100" className="fill-sage" />
    <g fill="none" className="stroke-cream-light" strokeWidth={2.4} strokeLinejoin="miter">
      {range(8).map((i) => (
        <path key={i} d={zigzagPath(i * 14.29 + 4, 9, 25)} />
      ))}
    </g>
  </>
);

const clayCompass = (
  <>
    <rect width="100" height="100" className="fill-mustard" />
    {CORNERS.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={13} className="fill-navy" />
    ))}
    <path
      d={concaveStarPath(50, 50, 44, 0.17)}
      className="fill-terracotta stroke-cream-light"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
    <circle cx={50} cy={50} r={7} className="fill-cream-light" />
    <circle cx={50} cy={50} r={3.5} className="fill-terracotta" />
  </>
);

const sunArc = (
  <>
    <rect width="100" height="100" className="fill-mustard" />
    <circle cx={100} cy={100} r={62} className="fill-navy" />
    <circle cx={100} cy={100} r={47} fill="none" className="stroke-cream-light" strokeWidth={3} />
    <circle cx={0} cy={0} r={30} fill="none" className="stroke-navy-dark" strokeWidth={3} />
    <circle cx={0} cy={0} r={18} className="fill-cream-light" />
  </>
);

const indigoArc = (
  <>
    <rect width="100" height="100" className="fill-navy" />
    <g fill="none" className="stroke-cream-light">
      {CORNERS.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={36} strokeWidth={3.5} />
          <circle cx={cx} cy={cy} r={27} strokeWidth={1.4} />
        </g>
      ))}
    </g>
    <path d="M50 41 L59 50 L50 59 L41 50Z" className="fill-mustard" />
  </>
);

export const TILE_ART: Readonly<Record<TileId, ReactElement>> = {
  'ocean-wave': oceanWave,
  'forest-fern': forestFern,
  'terracotta-dot': terracottaDot,
  'yellow-star': yellowStar,
  'azure-star': azureStar,
  'majolica-cross': majolicaCross,
  alhambra,
  'golden-weave': goldenWeave,
  'sage-chevron': sageChevron,
  'clay-compass': clayCompass,
  'sun-arc': sunArc,
  'indigo-arc': indigoArc,
};
