/*
 * Decorative artwork in the mockup's printed-sticker style. The drawings are
 * vectorised from the mockups (./traced). Everything here is aria-hidden.
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

/** The three "window" dots at the left of the top bar. */
export function WindowDots({ className }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-center u-gap-4 lg:gap-[6px] ${className ?? ''}`}>
      {['bg-terracotta', 'bg-mustard', 'bg-sage'].map((color) => (
        <span key={color} className={`u-size-10 rounded-full border-[1.5px] border-ink lg:size-[13px] ${color}`} />
      ))}
    </span>
  );
}
