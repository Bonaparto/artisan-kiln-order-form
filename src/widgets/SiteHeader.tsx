import { TileArt, type ArtId } from '@/entities/tile';
import { KilnBuilding, KilnOven } from '@/shared/illustrations';

/** The six little tiles that frame "The Artisan Kiln", as in the mockups. */
const LEFT_TILES: ArtId[] = ['indigo-arc', 'dot-grid', 'alhambra'];
const RIGHT_TILES: ArtId[] = ['delft', 'clay-flower', 'snowflake'];

function TileTrio({ tiles }: { tiles: ArtId[] }) {
  return (
    <span aria-hidden className="flex u-gap-5 lg:gap-[6px]">
      {tiles.map((tileId) => (
        <TileArt key={tileId} tileId={tileId} className="u-size-24.5 border-[1.5px] border-ink lg:size-[31px]" />
      ))}
    </span>
  );
}

/** Page title block: "Ceramic tile order form · The Artisan Kiln". */
export function SiteHeader() {
  return (
    <div className="relative flex items-center justify-center gap-[25px] u-pt-4 lg:pt-[12px]">
      <KilnBuilding className="hidden h-[74px] w-[55px] shrink-0 self-end lg:block" />
      <div className="flex flex-col items-center">
        <h1 className="text-center u-text-33 leading-none font-bold tracking-[0.004em] uppercase lg:text-[45px] lg:leading-[0.95]">
          Ceramic tile order form
        </h1>
        <div className="u-mt-2 flex items-center u-gap-12 lg:mt-[3px] lg:gap-[18px]">
          <TileTrio tiles={LEFT_TILES} />
          <p className="u-text-18.5 leading-none font-semibold whitespace-nowrap uppercase lg:text-[25.5px]">
            The Artisan Kiln
          </p>
          <TileTrio tiles={RIGHT_TILES} />
        </div>
      </div>
      <KilnOven className="hidden h-[70px] w-[60px] shrink-0 self-end lg:block" />
    </div>
  );
}
