import { describe, expect, it } from 'vitest';
import { TILE_ART } from '../ui/tile-art';
import { PALETTE_TILE_IDS, TILE_CATALOG, TILE_IDS } from './catalog';

describe('tile catalog', () => {
  it('has an entry, a price and artwork for every tile id', () => {
    for (const id of TILE_IDS) {
      expect(TILE_CATALOG[id]).toMatchObject({ id });
      expect(TILE_CATALOG[id].unitPrice).toBeGreaterThan(0);
      expect(TILE_ART[id]).toBeTruthy();
    }
    expect(Object.keys(TILE_CATALOG)).toHaveLength(TILE_IDS.length);
  });

  it('keeps the four tiles of the mockup order first, at the mockup prices', () => {
    expect(TILE_IDS.slice(0, 4).map((id) => [TILE_CATALOG[id].name, TILE_CATALOG[id].unitPrice])).toEqual([
      ['Ocean Wave', 2800],
      ['Forest Fern', 3000],
      ['Terracotta Dot', 2600],
      ['Yellow Star', 2900],
    ]);
  });

  it('builds the design palette from ten catalog tiles', () => {
    expect(PALETTE_TILE_IDS).toHaveLength(10);
    expect(new Set(PALETTE_TILE_IDS).size).toBe(10);
    for (const id of PALETTE_TILE_IDS) expect(TILE_IDS).toContain(id);
  });
});
