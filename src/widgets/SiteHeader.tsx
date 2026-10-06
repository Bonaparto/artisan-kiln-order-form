import { TileArt, type TileId } from '@/entities/tile';
import { KilnBuilding, KilnOven } from '@/shared/illustrations';

const LEFT_TILES: TileId[] = ['azure-star', 'terracotta-dot', 'alhambra'];
const RIGHT_TILES: TileId[] = ['majolica-cross', 'clay-compass', 'yellow-star'];

function TileTrio({ tiles }: { tiles: TileId[] }) {
  return (
    <span aria-hidden className="flex gap-[clamp(3px,1.1vw,7px)] lg:gap-[6px]">
      {tiles.map((tileId) => (
        <TileArt
          key={tileId}
          tileId={tileId}
          className="size-[clamp(20px,6.8vw,46px)] border-[1.5px] border-ink lg:size-[31px]"
        />
      ))}
    </span>
  );
}

/** Page title block: "Ceramic tile order form · The Artisan Kiln". */
export function SiteHeader() {
  return (
    <div className="relative flex items-center justify-center gap-[25px] px-4 pt-2 sm:pt-3 lg:pt-[12px]">
      <KilnBuilding className="hidden h-[74px] w-[55px] shrink-0 self-end lg:block" />
      <div className="flex flex-col items-center">
        <h1 className="text-center text-[clamp(26px,8.6vw,64px)] leading-[0.95] font-bold tracking-[0.004em] uppercase lg:text-[45px]">
          Ceramic tile order form
        </h1>
        <div className="mt-[clamp(4px,1.4vw,12px)] flex items-center gap-[clamp(6px,3vw,26px)] lg:mt-[3px] lg:gap-[18px]">
          <TileTrio tiles={LEFT_TILES} />
          <p className="text-[clamp(15px,4.9vw,40px)] leading-none font-semibold whitespace-nowrap uppercase lg:text-[25.5px]">
            The Artisan Kiln
          </p>
          <TileTrio tiles={RIGHT_TILES} />
        </div>
      </div>
      <KilnOven className="hidden h-[70px] w-[60px] shrink-0 self-end lg:block" />
    </div>
  );
}
