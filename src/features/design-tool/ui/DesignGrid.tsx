'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, type KeyboardEvent } from 'react';
import { TileArt, getTile, type TileId } from '@/entities/tile';
import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CELL_COUNT, GRID_SIZE, cellCleared, cellPainted, type DesignTool } from '../model/designSlice';
import { selectCells, selectTool } from '../model/selectors';
import { cellPosition, type DragData, type DropData } from './dnd';

const ROWS = Array.from({ length: GRID_SIZE }, (_, row) => row);

/**
 * The 7×7 board. Implements the ARIA grid pattern: one tab stop,
 * arrow keys / Home / End move between cells, Enter or Space applies the
 * active tool, Delete or Backspace clears a cell.
 */
export function DesignGrid({ dragging }: { dragging: DragData | null }) {
  const dispatch = useAppDispatch();
  const cells = useAppSelector(selectCells);
  const tool = useAppSelector(selectTool);
  const [focusIndex, setFocusIndex] = useState(0);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveFocus = (index: number) => {
    setFocusIndex(index);
    cellRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const { row, column } = cellPosition(index);
    const rowStart = (row - 1) * GRID_SIZE;
    const target: Record<string, number | undefined> = {
      ArrowRight: column < GRID_SIZE ? index + 1 : undefined,
      ArrowLeft: column > 1 ? index - 1 : undefined,
      ArrowDown: index + GRID_SIZE < CELL_COUNT ? index + GRID_SIZE : undefined,
      ArrowUp: index - GRID_SIZE >= 0 ? index - GRID_SIZE : undefined,
      Home: event.ctrlKey ? 0 : rowStart,
      End: event.ctrlKey ? CELL_COUNT - 1 : rowStart + GRID_SIZE - 1,
    };
    if (event.key in target) {
      event.preventDefault();
      const next = target[event.key];
      if (next !== undefined) moveFocus(next);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      dispatch(cellCleared(index));
    }
  };

  return (
    <div role="grid" aria-label={`Design board, ${GRID_SIZE} by ${GRID_SIZE} tiles`} className="flex flex-col bg-sand">
      {ROWS.map((row) => (
        <div key={row} role="row" className="grid grid-cols-7">
          {ROWS.map((column) => {
            const index = row * GRID_SIZE + column;
            return (
              <GridCell
                key={index}
                index={index}
                tileId={cells[index]}
                tool={tool}
                dragging={dragging}
                tabbable={index === focusIndex}
                lastColumn={column === GRID_SIZE - 1}
                lastRow={row === GRID_SIZE - 1}
                buttonRef={(node) => {
                  cellRefs.current[index] = node;
                }}
                onFocus={() => setFocusIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaint={() => dispatch(cellPainted(index))}
                onClear={() => dispatch(cellCleared(index))}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface GridCellProps {
  index: number;
  tileId: TileId | null;
  tool: DesignTool | null;
  dragging: DragData | null;
  tabbable: boolean;
  lastColumn: boolean;
  lastRow: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onPaint: () => void;
  onClear: () => void;
}

function GridCell({
  index,
  tileId,
  tool,
  dragging,
  tabbable,
  lastColumn,
  lastRow,
  buttonRef,
  onFocus,
  onKeyDown,
  onPaint,
  onClear,
}: GridCellProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `cell-${index}`,
    data: { target: 'cell', index } satisfies DropData,
  });
  const {
    setNodeRef: setDragRef,
    listeners,
    isDragging,
  } = useDraggable({
    id: `board-${index}`,
    data: tileId ? ({ source: 'board', tileId, index } satisfies DragData) : undefined,
    disabled: !tileId,
  });

  const { row, column } = cellPosition(index);
  const name = tileId ? getTile(tileId).name : null;
  // Ghost preview: the tile a drop (or a click with the brush) would lay here.
  const preview = isOver && dragging ? dragging.tileId : null;
  const showTile = tileId && !isDragging;

  const action =
    tool?.kind === 'tile'
      ? `Press Enter to lay ${getTile(tool.tileId).name}.`
      : tool?.kind === 'eraser' && tileId
        ? 'Press Enter to erase.'
        : '';

  return (
    <div
      ref={setDropRef}
      role="gridcell"
      className={cn(
        'relative aspect-square border-ink',
        !lastColumn && 'border-r-[1.5px]',
        !lastRow && 'border-b-[1.5px]',
      )}
    >
      <button
        ref={(node) => {
          buttonRef(node);
          setDragRef(node);
        }}
        type="button"
        tabIndex={tabbable ? 0 : -1}
        aria-label={`Row ${row}, column ${column}: ${name ?? 'empty'}. ${action}`.trim()}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onClick={onPaint}
        onContextMenu={(event) => {
          if (!tileId) return;
          event.preventDefault();
          onClear();
        }}
        {...listeners}
        className={cn(
          'group absolute inset-0 block touch-none overflow-hidden outline-offset-[-3px] select-none',
          tool?.kind === 'eraser' && tileId
            ? 'cursor-[not-allowed]'
            : tool
              ? 'cursor-copy'
              : tileId
                ? 'cursor-grab'
                : 'cursor-default',
          isDragging && 'outline-2 outline-ink/40 outline-dashed',
        )}
      >
        <AnimatePresence initial={false}>
          {showTile && (
            <motion.span
              key={tileId}
              className="absolute inset-0"
              initial={{ scale: 0.35, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.35, opacity: 0, transition: { duration: 0.14 } }}
              transition={{ type: 'spring', stiffness: 520, damping: 26 }}
            >
              <TileArt tileId={tileId} className="size-full" />
            </motion.span>
          )}
        </AnimatePresence>

        {preview && (
          <span className="absolute inset-0 opacity-70 ring-[3px] ring-navy ring-inset">
            <TileArt tileId={preview} className="size-full" />
          </span>
        )}

        {/* Hover hint: what the brush would lay / that the eraser would clear. */}
        {!dragging && tool?.kind === 'tile' && tool.tileId !== tileId && (
          <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-55">
            <TileArt tileId={tool.tileId} className="size-full" />
          </span>
        )}
        {!dragging && tool?.kind === 'eraser' && tileId && (
          <span className="absolute inset-0 bg-terracotta/0 transition-colors group-hover:bg-terracotta/45" />
        )}
      </button>
    </div>
  );
}
