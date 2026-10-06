import { dollars, type Cents } from '@/shared/lib/money';

/** Every tile the shop sells. The order here is the order of the design palette. */
export const TILE_IDS = [
  'ocean-wave',
  'forest-fern',
  'terracotta-dot',
  'yellow-star',
  'azure-star',
  'majolica-cross',
  'alhambra',
  'golden-weave',
  'sage-chevron',
  'clay-compass',
  'sun-arc',
  'indigo-arc',
] as const;

export type TileId = (typeof TILE_IDS)[number];

export interface Tile {
  id: TileId;
  name: string;
  /** Price per square foot. */
  unitPrice: Cents;
  /** One-liner shown in the "Add new tile" picker. */
  description: string;
}

export const TILE_CATALOG: Readonly<Record<TileId, Tile>> = {
  'ocean-wave': {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    unitPrice: dollars(28),
    description: 'Indigo swells on a cream glaze',
  },
  'forest-fern': {
    id: 'forest-fern',
    name: 'Forest Fern',
    unitPrice: dollars(30),
    description: 'Sage fronds, hand-painted',
  },
  'terracotta-dot': {
    id: 'terracotta-dot',
    name: 'Terracotta Dot',
    unitPrice: dollars(26),
    description: 'Scattered kiln-fired dots',
  },
  'yellow-star': {
    id: 'yellow-star',
    name: 'Yellow Star',
    unitPrice: dollars(29),
    description: 'Eight-point saffron stars',
  },
  'azure-star': {
    id: 'azure-star',
    name: 'Azure Star',
    unitPrice: dollars(32),
    description: 'Blue compass star, clay corners',
  },
  'majolica-cross': {
    id: 'majolica-cross',
    name: 'Majolica Cross',
    unitPrice: dollars(34),
    description: 'Classic Talavera cross',
  },
  alhambra: {
    id: 'alhambra',
    name: 'Alhambra',
    unitPrice: dollars(36),
    description: 'Nested sage diamonds',
  },
  'golden-weave': {
    id: 'golden-weave',
    name: 'Golden Weave',
    unitPrice: dollars(24),
    description: 'Mustard herringbone',
  },
  'sage-chevron': {
    id: 'sage-chevron',
    name: 'Sage Chevron',
    unitPrice: dollars(24),
    description: 'Green zig-zag chevron',
  },
  'clay-compass': {
    id: 'clay-compass',
    name: 'Clay Compass',
    unitPrice: dollars(31),
    description: 'Terracotta star on saffron',
  },
  'sun-arc': {
    id: 'sun-arc',
    name: 'Sun Arc',
    unitPrice: dollars(27),
    description: 'Saffron field, indigo arc',
  },
  'indigo-arc': {
    id: 'indigo-arc',
    name: 'Indigo Arc',
    unitPrice: dollars(27),
    description: 'Indigo with cream rings',
  },
};

export const getTile = (id: TileId): Tile => TILE_CATALOG[id];
