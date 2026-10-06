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
        'grid size-[30px] place-items-center rounded-[6px] border-[1.5px] border-transparent transition-colors disabled:opacity-35',
        pressed
          ? 'border-ink bg-navy text-cream-light'
          : 'hover:border-ink/70 hover:bg-cream/60 enabled:active:translate-y-px',
      )}
    >
      {children}
    </button>
  );
}

/** Status line + eraser / fill / clear under the board. */
export function DesignToolbar() {
  const dispatch = useAppDispatch();
  const tool = useAppSelector(selectTool);
  const filled = useAppSelector(selectFilledCount);

  const status =
    tool?.kind === 'tile' ? (
      <>
        Brush: <strong className="font-semibold uppercase">{getTile(tool.tileId).name}</strong> — click cells to lay it
      </>
    ) : tool?.kind === 'eraser' ? (
      <>Eraser on — click tiles to lift them</>
    ) : (
      <>
        {filled}/{CELL_COUNT} laid · pick a tile or drag it in
      </>
    );

  return (
    <div className="flex h-[38px] items-center gap-2 border-t-2 border-ink pr-1.5 pl-3">
      <p aria-live="polite" className="min-w-0 flex-1 truncate text-[14px] text-ink-soft">
        {status}
      </p>
      <ToolButton label="Eraser" pressed={tool?.kind === 'eraser'} onClick={() => dispatch(eraserToggled())}>
        <EraserIcon className="size-[18px]" />
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
        <FillIcon className="size-[18px]" />
      </ToolButton>
      <ToolButton label="Clear the board" disabled={filled === 0} onClick={() => dispatch(gridCleared())}>
        <SweepIcon className="size-[18px]" />
      </ToolButton>
    </div>
  );
}
