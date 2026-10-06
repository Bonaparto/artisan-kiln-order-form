'use client';

import { useCallback, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/** Share of the track the thumb takes — fixed, like the navy handle in the mockup. */
const THUMB = 0.4;

/**
 * The board shows six and a half rows, as in the desktop mockup; the rest
 * scrolls. The native scrollbar is hidden in favour of the mockup's navy
 * handle in the gutter beside the grid, which follows the scroll position
 * and can be dragged.
 */
export function BoardScroller({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  // Imperative positioning: scrolling must not re-render the 49 cells.
  const sync = useCallback(() => {
    const viewport = viewportRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !thumb) return;
    const max = viewport.scrollHeight - viewport.clientHeight;
    const progress = max > 0 ? viewport.scrollTop / max : 0;
    thumb.style.top = `${progress * (1 - THUMB) * 100}%`;
    thumb.style.visibility = max > 1 ? 'visible' : 'hidden';
  }, []);

  useLayoutEffect(() => {
    sync();
    const observer = new ResizeObserver(sync);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [sync]);

  const dragThumb = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const viewport = viewportRef.current;
    const track = event.currentTarget.parentElement;
    if (!viewport || !track) return;
    event.preventDefault();
    const startY = event.clientY;
    const startTop = viewport.scrollTop;
    const max = viewport.scrollHeight - viewport.clientHeight;
    const travel = track.clientHeight * (1 - THUMB);
    const move = (moveEvent: PointerEvent) => {
      viewport.scrollTop = startTop + ((moveEvent.clientY - startY) / travel) * max;
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  return (
    <div className="flex">
      <div
        ref={viewportRef}
        onScroll={sync}
        className="aspect-[7/6.45] min-w-0 flex-1 [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div aria-hidden className="relative w-[21px] shrink-0 py-[3px]">
        <div className="relative h-full">
          <span
            ref={thumbRef}
            onPointerDown={dragThumb}
            className="absolute left-1/2 h-[40%] w-[10px] -translate-x-1/2 cursor-grab rounded-full border border-ink bg-navy active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
}
