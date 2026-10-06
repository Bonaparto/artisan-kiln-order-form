import type { SVGProps } from 'react';
import { getTile, type TileId } from '../model/catalog';
import { TILE_ART } from './tile-art';

interface TileArtProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  tileId: TileId;
  /** Tiles per side: 1 renders a single tile, 2 a 2×2 swatch, and so on. */
  repeat?: number;
  /** Expose the tile name to assistive tech. Decorative by default. */
  labelled?: boolean;
}

/** A tile (or a seamless swatch of tiles) as inline SVG. */
export function TileArt({ tileId, repeat = 1, labelled = false, ...svgProps }: TileArtProps) {
  const art = TILE_ART[tileId];
  const size = 100 / repeat;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? getTile(tileId).name : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...svgProps}
    >
      {repeat === 1
        ? art
        : Array.from({ length: repeat * repeat }, (_, i) => (
            <svg
              key={i}
              x={(i % repeat) * size}
              y={Math.floor(i / repeat) * size}
              width={size}
              height={size}
              viewBox="0 0 100 100"
            >
              {art}
            </svg>
          ))}
    </svg>
  );
}
