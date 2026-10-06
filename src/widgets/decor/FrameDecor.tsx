import {
  ArchTile,
  FernFrond,
  FloralTile,
  NotchTile,
  Pot,
  QuarterTile,
  Shrub,
  Sprig,
  TriangleTile,
  UTile,
} from '@/shared/illustrations';
import { HandWithPalette, HandsHoldingTile } from '@/shared/illustrations/hands';
import { cn } from '@/shared/lib/cn';

/** Leaves, berries and tile shards running down one side of the desktop frame. */
function EdgeStrip({ side }: { side: 'left' | 'right' }) {
  const left = side === 'left';
  return (
    <div
      className={cn(
        'absolute top-[37px] bottom-0 hidden w-[clamp(26px,calc((100%-1240px)/2-4px),62px)] flex-col items-start pt-[3px] xl:flex',
        left ? 'left-0' : 'right-0 -scale-x-100',
      )}
    >
      {left ? <NotchTile className="-ml-[10%] w-[66%]" /> : <Pot className="-ml-[30%] w-[64%]" />}
      {left ? (
        <Pot className="-mt-[2%] -ml-[42%] w-[64%]" />
      ) : (
        <ArchTile tone="navy" className="mt-[10%] -ml-[8%] w-[66%]" />
      )}
      <Sprig pairs={5} className="mt-[22%] ml-[4%] w-[74%] -rotate-6" />
      <TriangleTile className="mt-[6%] ml-[14%] w-[44%]" />
      <ArchTile className="mt-[16%] -ml-[8%] w-[62%]" />
      <Shrub className="mt-[14%] w-[76%]" />
      <Sprig pairs={4} berries className="mt-[8%] ml-[8%] w-[66%]" />
      <Sprig pairs={7} className="mt-[4%] ml-[2%] w-[74%] rotate-3" />
      <Sprig pairs={6} className="-mt-[4%] ml-[6%] w-[70%] -rotate-3" />
      <div className="mt-auto mb-[6%] ml-[14%] flex w-[44%] flex-col gap-1">
        <TriangleTile className="w-full" />
        <QuarterTile tone="terracotta" className="w-full" />
      </div>
      {left ? <ArchTile tone="navy" className="-ml-[6%] w-full" /> : <FloralTile className="-ml-[6%] w-full" />}
    </div>
  );
}

/** Plants, tiles and hands along the bottom of the desktop frame. */
function BottomBand() {
  return (
    <div className="absolute inset-x-0 bottom-0 hidden h-[118px] xl:block">
      <div className="absolute bottom-0 left-[clamp(30px,5.4%,76px)] flex items-end gap-[6px]">
        <UTile className="w-[74px] translate-y-[3px]" />
        <QuarterTile className="w-[30px]" />
        <Shrub className="w-[52px]" />
        <Sprig pairs={3} berries className="w-[30px]" />
        <FernFrond pairs={7} className="w-[34px] rotate-12" />
        <Shrub className="w-[46px] -scale-x-100" />
        <FernFrond pairs={9} className="w-[36px] -rotate-6" />
      </div>
      <HandsHoldingTile className="absolute bottom-0 left-[27.5%] w-[104px]" />
      <FernFrond pairs={8} className="absolute bottom-[54px] left-[35.6%] w-[34px] rotate-[20deg]" />
      <HandWithPalette className="absolute right-[26.5%] bottom-0 w-[112px]" />
      <div className="absolute right-[clamp(30px,5.4%,76px)] bottom-0 flex items-end gap-[6px]">
        <FernFrond pairs={9} className="w-[36px] rotate-6" />
        <Shrub className="w-[50px]" />
        <Sprig pairs={3} berries className="w-[30px]" />
        <FernFrond pairs={7} className="w-[34px] -rotate-12" />
        <Shrub className="w-[44px] -scale-x-100" />
        <QuarterTile tone="navy" className="w-[30px] -scale-x-100" />
        <UTile className="w-[74px] translate-y-[3px]" />
      </div>
    </div>
  );
}

/** Ferns and "U" tiles tucked into the top corners, around the title. */
function TopCorners() {
  return (
    <>
      <div className="absolute top-[37px] left-[clamp(20px,3.4%,47px)] hidden items-start xl:flex">
        <FernFrond pairs={11} className="-mt-[6px] w-[60px] rotate-[38deg]" />
        <UTile className="mt-[3px] ml-[4px] w-[64px]" />
        <FernFrond pairs={10} className="-mt-[26px] ml-[4px] w-[50px] rotate-[64deg]" />
      </div>
      <div className="absolute top-[37px] right-[clamp(20px,3.4%,47px)] hidden items-start xl:flex">
        <FernFrond pairs={10} className="-mt-[26px] mr-[4px] w-[50px] -rotate-[64deg]" />
        <UTile className="mt-[3px] mr-[4px] w-[64px]" />
        <FernFrond pairs={11} className="-mt-[6px] w-[60px] -rotate-[38deg]" />
      </div>
    </>
  );
}

/** Mobile: shards peeking in at the title, and a strip of tiles and plants under the footer. */
function MobileDecor() {
  return (
    <div aria-hidden className="pointer-events-none lg:hidden">
      <NotchTile className="absolute u-top-28 u-left-n-10 u-w-22" />
      <Pot className="absolute u-top-62 u-left-n-12 u-w-28" />
      <Pot className="absolute u-top-30 u-right-n-12 u-w-26 -scale-x-100" />
      <ArchTile tone="navy" className="absolute u-top-80 u-right-n-10 u-w-26 -scale-x-100" />
      <div className="relative flex u-h-48 items-end overflow-hidden u-pl-6">
        <ArchTile tone="navy" className="u-w-40 shrink-0 translate-y-[2px]" />
        <UTile className="u-ml-2 u-w-45 shrink-0 translate-y-[2px]" />
        <QuarterTile className="u-ml-3 u-w-20 shrink-0" />
        <Shrub className="u-ml-2 u-w-30 shrink-0" />
        <Sprig pairs={3} berries className="u-w-17 shrink-0" />
        <FernFrond pairs={7} className="u-w-22 shrink-0 rotate-12" />
        <Shrub className="u-w-28 shrink-0 -scale-x-100" />
        <FernFrond pairs={8} className="u-w-22 shrink-0 -rotate-12" />
        <Shrub className="u-w-26 shrink-0" />
      </div>
    </div>
  );
}

export function FrameDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <EdgeStrip side="left" />
      <EdgeStrip side="right" />
      <TopCorners />
      <BottomBand />
    </div>
  );
}

export { MobileDecor };
