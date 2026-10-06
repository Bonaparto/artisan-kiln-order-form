import type { SVGProps } from 'react';
import type { TileId } from '../model/catalog';
import { TILE_ART, TILE_MOTIF, TILE_SWATCH, type ArtId } from './tile-art';

interface TileArtProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  tileId: ArtId;
  /**
   * `tile` — the tile as laid on the board (default);
   * `motif` — the icon in the cart's "Tile collection" column;
   * `swatch` — the larger-scale pattern in the cart's "Item" column.
   */
  variant?: 'tile' | 'motif' | 'swatch';
}

const pick = (tileId: ArtId, variant: TileArtProps['variant']) => {
  if (variant === 'motif') return TILE_MOTIF[tileId as TileId] ?? TILE_ART[tileId];
  if (variant === 'swatch') return TILE_SWATCH[tileId as TileId] ?? TILE_ART[tileId];
  return TILE_ART[tileId];
};

/** A tile as inline SVG. Decorative: the controls around it carry the labels. */
export function TileArt({ tileId, variant = 'tile', ...svgProps }: TileArtProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false" {...svgProps}>
      {pick(tileId, variant)}
    </svg>
  );
}
