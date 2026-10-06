import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithStore } from '@/test/render';
import { DesignBoardProvider } from './DesignBoardProvider';
import { DesignTool } from './DesignTool';

const cell = (row: number, column: number) =>
  screen.getByRole('button', { name: new RegExp(`^Row ${row}, column ${column}:`) });

describe('<DesignTool />', () => {
  it('shows the ten palette tiles of the mockup', () => {
    renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );
    const palette = screen.getByRole('list', { name: 'Design palette' });
    expect(
      within(palette)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      'Rosa Bloom',
      'Azure Star',
      'Verde Lattice',
      'Saffron Star',
      'Majolica Cross',
      'Golden Herringbone',
      'Sage Herringbone',
      'Blue Swallow',
      'Clay Medallion',
      'Night Dove',
    ]);
  });

  it('lays a picked palette tile on the clicked cell', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );

    const bloom = screen.getByRole('button', { name: 'Rosa Bloom', pressed: false });
    await user.click(bloom);
    expect(bloom).toHaveAttribute('aria-pressed', 'true');

    await user.click(cell(7, 7));

    expect(store.getState().design.cells[48]).toBe('rosa-bloom');
    expect(cell(7, 7)).toHaveAccessibleName(/^Row 7, column 7: Rosa Bloom/);
  });

  it('erases with the eraser tool and with the Delete key', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Eraser' }));
    await user.click(cell(1, 1));
    expect(store.getState().design.cells[0]).toBeNull();

    cell(1, 2).focus();
    await user.keyboard('{Delete}');
    expect(store.getState().design.cells[1]).toBeNull();
  });

  it('is one tab stop with arrow-key navigation inside', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );
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
    const { store } = renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Night Dove' }));
    expect(store.getState().design.tool).toEqual({ kind: 'tile', tileId: 'night-dove' });
    await user.keyboard('{Escape}');
    expect(store.getState().design.tool).toBeNull();
  });

  it('clears the whole board', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <DesignBoardProvider>
        <DesignTool />
      </DesignBoardProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Clear the board' }));

    expect(store.getState().design.cells.every((value) => value === null)).toBe(true);
    expect(screen.getByText('0 of 49 cells laid.')).toBeInTheDocument();
  });
});
