'use client';

import type { ReactNode } from 'react';
import { getTile } from '@/entities/tile';
import { EraserIcon, FillIcon, SweepIcon } from '@/shared/icons';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CELL_COUNT, emptyCellsFilled, eraserToggled, gridCleared } from '../model/designSlice';
import { selectFilledCount, selectTool } from '../model/selectors';

function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid size-[30px] place-items-center rounded-[6px] border-[1.5px] border-ink/60 transition-colors disabled:opacity-35',
        pressed
          ? 'border-ink bg-navy text-cream-light'
          : 'bg-cream/60 hover:border-ink hover:bg-cream enabled:active:translate-y-px',
      )}
    >
      {children}
    </button>
  );
}

/** Eraser / fill / clear, tucked under the palette tiles. */
export function DesignToolbar({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const tool = useAppSelector(selectTool);
  const filled = useAppSelector(selectFilledCount);

  return (
    <div role="toolbar" aria-label="Board tools" className={cn('flex justify-center gap-1.5', className)}>
      <ToolButton label="Eraser" pressed={tool?.kind === 'eraser'} onClick={() => dispatch(eraserToggled())}>
        <EraserIcon className="size-[17px]" />
      </ToolButton>
      <ToolButton
        label={
          tool?.kind === 'tile'
            ? `Fill empty cells with ${getTile(tool.tileId).name}`
            : 'Fill empty cells (pick a tile first)'
        }
        disabled={tool?.kind !== 'tile' || filled === CELL_COUNT}
        onClick={() => tool?.kind === 'tile' && dispatch(emptyCellsFilled(tool.tileId))}
      >
        <FillIcon className="size-[17px]" />
      </ToolButton>
      <ToolButton label="Clear the board" disabled={filled === 0} onClick={() => dispatch(gridCleared())}>
        <SweepIcon className="size-[17px]" />
      </ToolButton>
    </div>
  );
}

/** What the board is doing right now, for screen readers. */
export function BoardStatus() {
  const tool = useAppSelector(selectTool);
  const filled = useAppSelector(selectFilledCount);
  const status =
    tool?.kind === 'tile'
      ? `Brush: ${getTile(tool.tileId).name}. Click cells to lay it.`
      : tool?.kind === 'eraser'
        ? 'Eraser on. Click tiles to lift them.'
        : `${filled} of ${CELL_COUNT} cells laid.`;
  return (
    <p aria-live="polite" className="sr-only">
      {status}
    </p>
  );
}
