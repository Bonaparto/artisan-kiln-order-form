import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BoardScroller } from './BoardScroller';

/** jsdom has no layout: give the scroll area and the handle tracks real-looking sizes. */
function fake(element: Element, values: Record<string, number>) {
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(element, key, { configurable: true, writable: true, value });
  }
}

function renderScroller() {
  const { container } = render(
    <BoardScroller>
      <div data-testid="board" />
    </BoardScroller>,
  );
  const viewport = screen.getByTestId('board').parentElement!.parentElement!;
  const pill = container.querySelector<HTMLElement>('[data-scroll-handle="x"]')!;
  const thumb = container.querySelector<HTMLElement>('[data-scroll-handle="y"]')!;
  // 40px of horizontal and 50px of vertical overflow.
  fake(viewport, {
    scrollWidth: 400,
    clientWidth: 360,
    scrollHeight: 400,
    clientHeight: 350,
    scrollLeft: 0,
    scrollTop: 0,
  });
  fake(pill.parentElement!, { clientWidth: 120 }); // 120 - 58px pill = 62px of travel
  fake(thumb.parentElement!, { clientHeight: 300 }); // 60% of it = 180px of travel
  fireEvent.scroll(viewport);
  return { viewport, pill, thumb };
}

describe('<BoardScroller />', () => {
  it('shows both handles when the board overflows', () => {
    const { pill, thumb } = renderScroller();
    expect(pill.style.visibility).toBe('visible');
    expect(thumb.style.visibility).toBe('visible');
  });

  it('scrolls the board sideways when the bottom pill is dragged', () => {
    const { viewport, pill } = renderScroller();
    fireEvent.pointerDown(pill, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 131 });
    fireEvent.pointerUp(window);
    expect(viewport.scrollLeft).toBe(20);
    // Released: further moves do nothing.
    fireEvent.pointerMove(window, { clientX: 200 });
    expect(viewport.scrollLeft).toBe(20);
  });

  it('scrolls the board vertically when the side thumb is dragged', () => {
    const { viewport, thumb } = renderScroller();
    fireEvent.pointerDown(thumb, { clientY: 10 });
    fireEvent.pointerMove(window, { clientY: 100 });
    fireEvent.pointerUp(window);
    expect(viewport.scrollTop).toBe(25);
  });

  it('moves the side thumb along with the scroll position', () => {
    const { viewport, thumb } = renderScroller();
    viewport.scrollTop = 50;
    fireEvent.scroll(viewport);
    expect(thumb.style.top).toBe('60%');
  });
});
