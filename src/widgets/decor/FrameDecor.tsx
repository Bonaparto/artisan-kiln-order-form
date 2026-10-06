import { ArchTile, NotchTile, Pot, QuarterTile, Shrub, Sprig, TriangleTile } from '@/shared/illustrations';
import { cn } from '@/shared/lib/cn';
import { HandWithPalette, HandsHoldingTile } from './Hands';

/** Leaves, berries and tile shards running down one side of the desktop frame. */
function EdgeStrip({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'absolute top-[37px] bottom-0 hidden w-[clamp(26px,calc((100%-1240px)/2-4px),62px)] flex-col items-start justify-between pt-1 pb-0 xl:flex',
        side === 'left' ? 'left-0' : 'right-0 -scale-x-100',
      )}
    >
      <NotchTile className="-ml-[18%] w-[66%]" />
      <Pot className="-mt-[12%] -ml-[40%] w-[64%]" />
      <Sprig pairs={5} className="ml-[2%] w-[72%] -rotate-6" />
      <TriangleTile className="ml-[14%] w-[46%]" />
      <ArchTile className="-ml-[8%] w-[62%]" />
      <Shrub className="w-[74%]" />
      <Sprig pairs={4} berries className="ml-[6%] w-[66%]" />
      <Sprig pairs={8} className="ml-[2%] w-[72%] rotate-3" />
      <div className="ml-[12%] flex w-[52%] flex-col gap-1">
        <TriangleTile className="w-full" />
        <QuarterTile tone="terracotta" className="w-full" />
      </div>
      <ArchTile tone="navy" className="-ml-[6%] w-full" />
    </div>
  );
}

/** Plants, tiles and hands along the bottom of the frame. */
function BottomBand() {
  return (
    <div className="absolute inset-x-0 bottom-0 hidden h-[118px] lg:block">
      <div className="absolute bottom-0 left-[clamp(30px,6%,84px)] flex items-end gap-1.5">
        <ArchTile className="w-[64px] translate-y-1" />
        <QuarterTile className="w-[30px]" />
        <Shrub className="w-[56px]" />
        <Sprig pairs={3} berries className="w-[34px]" />
        <Shrub className="w-[48px] -scale-x-100" />
        <Sprig pairs={4} className="w-[40px] rotate-12" />
      </div>
      <HandsHoldingTile className="absolute bottom-0 left-[27.5%] hidden w-[104px] xl:block" />
      <HandWithPalette className="absolute right-[26.5%] bottom-0 hidden w-[112px] xl:block" />
      <div className="absolute right-[clamp(30px,6%,84px)] bottom-0 flex items-end gap-1.5">
        <Sprig pairs={4} className="w-[40px] -rotate-12" />
        <Shrub className="w-[52px]" />
        <Sprig pairs={3} berries className="w-[34px]" />
        <Shrub className="w-[48px] -scale-x-100" />
        <QuarterTile tone="navy" className="w-[30px] -scale-x-100" />
        <ArchTile className="w-[64px] translate-y-1" />
      </div>
    </div>
  );
}

/** Ferns and tiles tucked into the top corners, around the title. */
function TopCorners() {
  return (
    <>
      <div className="absolute top-[38px] left-[clamp(20px,4.6%,66px)] hidden h-[84px] items-start xl:flex">
        <Sprig pairs={4} className="-mt-3 w-[34px] -rotate-[68deg]" />
        <ArchTile className="mt-1 ml-5 w-[56px]" />
        <Sprig pairs={4} className="-mt-5 ml-6 w-[30px] rotate-[72deg]" />
      </div>
      <div className="absolute top-[38px] right-[clamp(20px,4.6%,66px)] hidden h-[84px] items-start xl:flex">
        <Sprig pairs={4} className="-mt-5 mr-6 w-[30px] -rotate-[72deg]" />
        <ArchTile className="mt-1 mr-5 w-[56px]" />
        <Sprig pairs={4} className="-mt-3 w-[34px] rotate-[68deg]" />
      </div>
    </>
  );
}

/** Mobile: shards peeking from the edges and a strip of plants and tiles at the bottom. */
function MobileDecor() {
  return (
    <div aria-hidden className="lg:hidden">
      <NotchTile className="absolute top-[46px] -left-[22px] w-[30px] sm:top-[60px] sm:-left-[14px] sm:w-[42px]" />
      <Pot className="absolute top-[86px] -left-[26px] w-[36px] sm:top-[116px] sm:w-[52px]" />
      <Pot className="absolute top-[44px] -right-[24px] w-[34px] -scale-x-100 sm:top-[56px] sm:w-[50px]" />
      <ArchTile
        tone="navy"
        className="absolute top-[84px] -right-[26px] w-[38px] -scale-x-100 sm:top-[116px] sm:-right-[18px] sm:w-[56px]"
      />
      <div className="pointer-events-none relative -mt-12 flex h-[96px] items-end overflow-hidden sm:-mt-14 sm:h-[120px]">
        <ArchTile tone="navy" className="w-[56px] shrink-0 translate-y-1 sm:w-[72px]" />
        <ArchTile className="ml-1.5 w-[50px] shrink-0 translate-y-1 sm:w-[64px]" />
        <QuarterTile className="ml-1 w-[24px] shrink-0 sm:w-[30px]" />
        <Shrub className="ml-1 w-[44px] shrink-0" />
        <Sprig pairs={3} berries className="w-[30px] shrink-0" />
        <Shrub className="w-[40px] shrink-0 -scale-x-100" />
        <Sprig pairs={4} className="w-[34px] shrink-0 rotate-12" />
        <HandsHoldingTile className="absolute right-1 bottom-0 w-[96px] sm:w-[120px]" />
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
