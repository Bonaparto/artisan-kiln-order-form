import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithStore } from '@/test/render';
import { DesignTool } from './DesignTool';

const cell = (row: number, column: number) =>
  screen.getByRole('button', { name: new RegExp(`^Row ${row}, column ${column}:`) });

describe('<DesignTool />', () => {
  it('lays a picked palette tile on the clicked cell', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DesignTool />);

    const fern = screen.getByRole('button', { name: /^Forest Fern/, pressed: false });
    await user.click(fern);
    expect(fern).toHaveAttribute('aria-pressed', 'true');

    await user.click(cell(7, 7));

    expect(store.getState().design.cells[48]).toBe('forest-fern');
    expect(cell(7, 7)).toHaveAccessibleName(/^Row 7, column 7: Forest Fern/);
  });

  it('erases with the eraser tool and with the Delete key', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DesignTool />);

    await user.click(screen.getByRole('button', { name: 'Eraser' }));
    await user.click(cell(1, 1));
    expect(store.getState().design.cells[0]).toBeNull();

    cell(1, 2).focus();
    await user.keyboard('{Delete}');
    expect(store.getState().design.cells[1]).toBeNull();
  });

  it('is one tab stop with arrow-key navigation inside', async () => {
    const user = userEvent.setup();
    renderWithStore(<DesignTool />);
    const grid = screen.getByRole('grid');
    const tabbable = grid.querySelectorAll('button[tabindex="0"]');
    expect(tabbable).toHaveLength(1);

    cell(1, 1).focus();
    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowDown}');
    expect(cell(3, 2)).toHaveFocus();
    await user.keyboard('{End}');
    expect(cell(3, 7)).toHaveFocus();
  });

  it('Escape puts the brush down', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DesignTool />);

    await user.click(screen.getByRole('button', { name: /^Sun Arc/ }));
    expect(store.getState().design.tool).toEqual({ kind: 'tile', tileId: 'sun-arc' });
    await user.keyboard('{Escape}');
    expect(store.getState().design.tool).toBeNull();
  });

  it('clears the whole board', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<DesignTool />);

    await user.click(screen.getByRole('button', { name: 'Clear the board' }));

    expect(store.getState().design.cells.every((value) => value === null)).toBe(true);
    expect(screen.getByText(/0\/49 laid/)).toBeInTheDocument();
  });
});
