'use client';

import { useCallback, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/** Columns and rows in view; the board is 7×7, the rest scrolls — as drawn in the mockup. */
const VISIBLE_COLUMNS = 6.65;
const VISIBLE_ROWS = 6.45;
/** The vertical handle takes a fixed share of its track; the horizontal pill is a fixed 58px. */
const V_THUMB = 0.4;
const H_THUMB_PX = 58;

/**
 * Two-axis scroll area for the design board. Native scrollbars are hidden
 * in favour of the mockup's navy handles: one in the gutter beside the grid,
 * one as the pill under it. Both follow the scroll position and can be
 * dragged; wheel, trackpad and keyboard focus scroll natively.
 */
export function BoardScroller({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const vThumbRef = useRef<HTMLSpanElement>(null);
  const hThumbRef = useRef<HTMLSpanElement>(null);

  // Imperative positioning: scrolling must not re-render the 49 cells.
  const sync = useCallback(() => {
    const viewport = viewportRef.current;
    const vThumb = vThumbRef.current;
    const hThumb = hThumbRef.current;
    if (!viewport || !vThumb || !hThumb) return;
    const maxY = viewport.scrollHeight - viewport.clientHeight;
    const maxX = viewport.scrollWidth - viewport.clientWidth;
    const y = maxY > 0 ? viewport.scrollTop / maxY : 0;
    const x = maxX > 0 ? viewport.scrollLeft / maxX : 0;
    vThumb.style.top = `${y * (1 - V_THUMB) * 100}%`;
    vThumb.style.visibility = maxY > 1 ? 'visible' : 'hidden';
    hThumb.style.left = `calc((100% - ${H_THUMB_PX}px) * ${x})`;
    hThumb.style.visibility = maxX > 1 ? 'visible' : 'hidden';
  }, []);

  useLayoutEffect(() => {
    sync();
    const observer = new ResizeObserver(sync);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [sync]);

  /** Drag a handle: pointer travel along its track maps onto the scroll range. */
  const dragHandle = (axis: 'x' | 'y') => (event: ReactPointerEvent<HTMLSpanElement>) => {
    const viewport = viewportRef.current;
    const track = event.currentTarget.parentElement;
    if (!viewport || !track) return;
    event.preventDefault();
    const start = axis === 'y' ? event.clientY : event.clientX;
    const startScroll = axis === 'y' ? viewport.scrollTop : viewport.scrollLeft;
    const max =
      axis === 'y' ? viewport.scrollHeight - viewport.clientHeight : viewport.scrollWidth - viewport.clientWidth;
    const travel = axis === 'y' ? track.clientHeight * (1 - V_THUMB) : track.clientWidth - H_THUMB_PX;
    const move = (moveEvent: PointerEvent) => {
      const delta = ((axis === 'y' ? moveEvent.clientY : moveEvent.clientX) - start) / travel;
      if (axis === 'y') viewport.scrollTop = startScroll + delta * max;
      else viewport.scrollLeft = startScroll + delta * max;
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  return (
    <div>
      <div className="flex">
        <div
          ref={viewportRef}
          onScroll={sync}
          style={{ aspectRatio: `${VISIBLE_COLUMNS} / ${VISIBLE_ROWS}` }}
          className="min-w-0 flex-1 [scrollbar-width:none] overflow-auto [&::-webkit-scrollbar]:hidden"
        >
          <div style={{ width: `${(7 / VISIBLE_COLUMNS) * 100}%` }}>{children}</div>
        </div>
        <div aria-hidden className="relative w-[21px] shrink-0 py-[3px]">
          <div className="relative h-full">
            <span
              ref={vThumbRef}
              data-scroll-handle="y"
              onPointerDown={dragHandle('y')}
              className="absolute left-1/2 h-[40%] w-[10px] -translate-x-1/2 cursor-grab rounded-full border border-ink bg-navy active:cursor-grabbing"
            />
          </div>
        </div>
      </div>
      <div aria-hidden className="relative h-[25px] border-t-[1.5px] border-ink">
        {/* A short track around the centre, so the pill sits where the mockup draws it. */}
        <div className="absolute inset-y-0 right-[33%] left-[33%]">
          <span
            ref={hThumbRef}
            data-scroll-handle="x"
            onPointerDown={dragHandle('x')}
            style={{ width: H_THUMB_PX }}
            className="absolute top-1/2 h-[11px] -translate-y-1/2 cursor-grab rounded-full border border-ink bg-navy active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
}
