import { dollars, type Cents } from '@/shared/lib/money';

/** Every tile the shop sells. */
export const TILE_IDS = [
  // The order from the mockups.
  'ocean-wave',
  'forest-fern',
  'terracotta-dot',
  'yellow-star',
  // The design palette, in mockup order.
  'rosa-bloom',
  'azure-star',
  'verde-lattice',
  'saffron-star',
  'majolica-cross',
  'golden-herringbone',
  'sage-herringbone',
  'blue-swallow',
  'clay-medallion',
  'night-dove',
  // Tiles already laid on the sample board.
  'sun-arc',
  'indigo-arc',
  'saffron-compass',
  'clay-compass',
  'indigo-curve',
  'snowflake',
  'alhambra',
] as const;

export type TileId = (typeof TILE_IDS)[number];

/** The ten tiles of the "Design palette" column, as in the desktop mockup. */
export const PALETTE_TILE_IDS: readonly TileId[] = [
  'rosa-bloom',
  'azure-star',
  'verde-lattice',
  'saffron-star',
  'majolica-cross',
  'golden-herringbone',
  'sage-herringbone',
  'blue-swallow',
  'clay-medallion',
  'night-dove',
];

export interface Tile {
  id: TileId;
  name: string;
  /** Price per square foot. */
  unitPrice: Cents;
  /** One-liner shown in the "Add new tile" picker. */
  description: string;
}

const tile = (id: TileId, name: string, price: number, description: string): [TileId, Tile] => [
  id,
  { id, name, unitPrice: dollars(price), description },
];

export const TILE_CATALOG = Object.fromEntries([
  tile('ocean-wave', 'Ocean Wave', 28, 'Indigo swells on a cream glaze'),
  tile('forest-fern', 'Forest Fern', 30, 'Sage fronds, hand-painted'),
  tile('terracotta-dot', 'Terracotta Dot', 26, 'Kiln-fired polka dots'),
  tile('yellow-star', 'Yellow Star', 29, 'A saffron star on cream'),
  tile('rosa-bloom', 'Rosa Bloom', 32, 'Ditsy terracotta florals'),
  tile('azure-star', 'Azure Star', 32, 'Indigo star, clay rings'),
  tile('verde-lattice', 'Verde Lattice', 34, 'Sage lattice, clay diamonds'),
  tile('saffron-star', 'Saffron Star', 31, 'A field of eight-point stars'),
  tile('majolica-cross', 'Majolica Cross', 34, 'Classic Talavera cross'),
  tile('golden-herringbone', 'Golden Herringbone', 24, 'Mustard parquet'),
  tile('sage-herringbone', 'Sage Herringbone', 24, 'Green parquet'),
  tile('blue-swallow', 'Blue Swallow', 38, 'Talavera swallow and sprig'),
  tile('clay-medallion', 'Clay Medallion', 33, 'Terracotta with sage arches'),
  tile('night-dove', 'Night Dove', 38, 'Cream dove on indigo'),
  tile('sun-arc', 'Sun Arc', 27, 'Saffron with cream arcs'),
  tile('indigo-arc', 'Indigo Arc', 27, 'Indigo with cream rings'),
  tile('saffron-compass', 'Saffron Compass', 31, 'Clay star on saffron'),
  tile('clay-compass', 'Clay Compass', 31, 'Terracotta star, indigo rings'),
  tile('indigo-curve', 'Indigo Curve', 27, 'Indigo with cream bands'),
  tile('snowflake', 'Snowflake', 29, 'Saffron snowflake on cream'),
  tile('alhambra', 'Alhambra', 36, 'Sage star with leaf corners'),
]) as Readonly<Record<TileId, Tile>>;

export const getTile = (id: TileId): Tile => TILE_CATALOG[id];
