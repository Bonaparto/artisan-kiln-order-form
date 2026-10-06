import { HandsHoldingTile, HandWithPalette, TileSprig } from '@/shared/illustrations';
import {
  BottomLeftDecor,
  BottomRightDecor,
  LeftEdgeDecor,
  MobileBottomDecor,
  MobileTopLeftDecor,
  MobileTopRightDecor,
  RightEdgeDecor,
  TopLeftDecor,
  TopRightDecor,
} from './traced';

/*
 * The decoration around the page, traced from the mockups and placed at
 * their mockup coordinates. Below the mockup width the side margins shrink,
 * so the edge strips slide out under the frame edge instead of over the
 * content: each one keeps a gap to the content column's padding.
 */
const LEFT_PEEK = 'left-[min(0px,calc(clamp(28px,calc((100%-1240px)/2),68px)-64px))]';
const RIGHT_PEEK = 'right-[min(0px,calc(clamp(28px,calc((100%-1252px)/2),60px)-60px))]';

/** Desktop: corners, both side strips and the bottom band with the hands. */
export function FrameDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
      <TopLeftDecor className="absolute top-[35px] left-0 w-[268.5px]" />
      <TopRightDecor className="absolute top-[35px] right-0 w-[268.5px]" />
      <LeftEdgeDecor className={`absolute top-[141.25px] w-[53.75px] ${LEFT_PEEK}`} />
      <RightEdgeDecor className={`absolute top-[141.25px] w-[53.25px] ${RIGHT_PEEK}`} />
      <BottomLeftDecor className="absolute -bottom-[2px] left-px w-[369px]" />
      <BottomRightDecor className="absolute right-[1.25px] -bottom-[2px] w-[361.75px]" />
      <HandsHoldingTile className="absolute bottom-0 left-[27.3%] w-[102px]" />
      <TileSprig className="absolute bottom-[68px] left-[32.3%] w-[35px]" />
      <HandWithPalette className="absolute right-[26.45%] bottom-0 w-[113px]" />
    </div>
  );
}

/** Mobile: shards beside the title, and tiles and plants along the bottom under the footer. */
export function MobileDecor() {
  return (
    <div aria-hidden className="pointer-events-none lg:hidden">
      <MobileTopLeftDecor className="absolute u-top-30.25 u-left-n-2 u-w-24" />
      <MobileTopRightDecor className="absolute u-top-33.5 u-right-n-2 u-w-20.75" />
      {/* Room for the bottom strip below the footer. */}
      <div className="u-h-48" />
      <MobileBottomDecor className="absolute u-bottom-n-2 u-left-n-2 u-w-293" />
      {/* The mockup ends on these; here they follow the order button, in the corner. */}
      <TileSprig className="absolute u-right-n-3.75 u-bottom-58 u-w-30.75" />
      <HandsHoldingTile className="absolute u-right-n-2 u-bottom-n-2 u-w-89.75" />
    </div>
  );
}
