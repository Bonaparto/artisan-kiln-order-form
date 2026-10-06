/**
 * Small path builders for the tile artwork. Every tile is drawn in a
 * 100×100 viewBox; motifs that cross an edge continue on the neighbouring
 * tile, so a 2×2 repeat reads as a seamless surface.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A horizontal sine-like wave built from cubic Béziers.
 * `period` should divide 100 for the line to continue across tile edges.
 */
export function wavePath(y: number, amplitude: number, period: number, phase = 0): string {
  const half = period / 2;
  // A cubic with both control points at 4/3·A peaks at exactly A.
  const k = (amplitude * 4) / 3;
  let x = -period + phase;
  let d = `M${r2(x)} ${r2(y)} C${r2(x + 0.35 * half)} ${r2(y - k)} ${r2(x + 0.65 * half)} ${r2(y - k)} ${r2(x + half)} ${r2(y)}`;
  let up = true;
  for (x += half; x < 100 + period; x += half) {
    up = !up;
    const cy = up ? y - k : y + k;
    d += ` S${r2(x + 0.65 * half)} ${r2(cy)} ${r2(x + half)} ${r2(y)}`;
  }
  return d;
}

/** Straight-segment zig-zag across the tile. */
export function zigzagPath(y: number, amplitude: number, period: number): string {
  const half = period / 2;
  let d = `M${-period} ${y}`;
  let up = true;
  for (let x = -period + half; x <= 100 + period; x += half) {
    d += ` L${r2(x)} ${r2(up ? y - amplitude : y)}`;
    up = !up;
  }
  return d;
}

/** Regular n-point star. */
export function starPath(cx: number, cy: number, points: number, outer: number, inner: number): string {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${r2(cx + radius * Math.cos(angle))} ${r2(cy + radius * Math.sin(angle))} `;
  }
  return `${d}Z`;
}

/**
 * Four-point star whose sides bow inwards (the classic cement-tile "compass").
 * `pinch` 0 → needle-thin rays, 0.5 → almost a diamond.
 */
export function concaveStarPath(cx: number, cy: number, radius: number, pinch = 0.2): string {
  const c = radius * pinch;
  return [
    `M${cx} ${cy - radius}`,
    `Q${cx + c} ${cy - c} ${cx + radius} ${cy}`,
    `Q${cx + c} ${cy + c} ${cx} ${cy + radius}`,
    `Q${cx - c} ${cy + c} ${cx - radius} ${cy}`,
    `Q${cx - c} ${cy - c} ${cx} ${cy - radius}Z`,
  ].join(' ');
}

/** Pointed lens-shaped leaf lying along the +x axis from the origin. */
export function leafPath(length: number, width: number): string {
  return `M0 0 Q${r2(length / 2)} ${r2(-width)} ${r2(length)} 0 Q${r2(length / 2)} ${r2(width)} 0 0Z`;
}

export interface Leaflet {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
}

/**
 * A fern frond: a straight stem from (x, y) heading `angle` degrees,
 * with leaflets that taper towards the tip.
 */
export function frondLeaflets(
  x: number,
  y: number,
  angle: number,
  length: number,
  pairs: number,
  leafLength: number,
): { stem: string; leaflets: Leaflet[] } {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const leaflets: Leaflet[] = [];
  for (let i = 0; i < pairs; i++) {
    const t = (i + 0.6) / (pairs + 0.4);
    const px = x + dx * length * t;
    const py = y + dy * length * t;
    const size = leafLength * (1 - t * 0.55);
    for (const side of [-1, 1]) {
      leaflets.push({ x: r2(px), y: r2(py), angle: r2(angle + side * 52), length: r2(size), width: r2(size * 0.28) });
    }
  }
  // Terminal leaflet continues the stem.
  leaflets.push({
    x: r2(x + dx * length),
    y: r2(y + dy * length),
    angle,
    length: r2(leafLength * 0.42),
    width: r2(leafLength * 0.12),
  });
  return { stem: `M${x} ${y} L${r2(x + dx * length)} ${r2(y + dy * length)}`, leaflets };
}
