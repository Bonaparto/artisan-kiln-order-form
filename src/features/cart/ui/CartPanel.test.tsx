import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithStore } from '@/test/render';
import { CartPanel } from './CartPanel';

const totals = () => {
  const list = screen.getByText('Subtotal:').closest('dl')!;
  const value = (label: string) => within(list).getByText(label).nextElementSibling!.textContent;
  return { subtotal: value('Subtotal:'), shipping: value('Shipping:'), grandTotal: value('Grand total:') };
};

describe('<CartPanel />', () => {
  it('renders the mockup order with its totals', () => {
    renderWithStore(<CartPanel />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows.map((row) => within(row).getByRole('rowheader').textContent)).toEqual([
      'Ocean Wave',
      'Forest Fern',
      'Terracotta Dot',
      'Yellow Star',
    ]);
    expect(screen.getByRole('textbox', { name: 'Ocean Wave quantity, square feet' })).toHaveValue('150');
    expect(totals()).toEqual({ subtotal: '$13,100.00', shipping: '$0.00', grandTotal: '$13,100.00' });
  });

  it('recalculates totals as quantities change', async () => {
    const user = userEvent.setup();
    renderWithStore(<CartPanel />);

    for (const name of ['Ocean Wave', 'Forest Fern', 'Terracotta Dot', 'Yellow Star']) {
      const input = screen.getByRole('textbox', { name: `${name} quantity, square feet` });
      await user.clear(input);
      await user.type(input, '2');
    }

    // 2 × (28 + 30 + 26 + 29) = 226 → under $500, so $25 shipping applies
    expect(totals()).toEqual({ subtotal: '$226.00', shipping: '$25.00', grandTotal: '$251.00' });
  });

  it('steps the quantity with "Add" and the arrow keys', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<CartPanel />);

    await user.click(screen.getByRole('button', { name: 'Add 1 sq. ft. of Yellow Star' }));
    expect(store.getState().cart.entities['yellow-star'].quantity).toBe(51);

    const input = screen.getByRole('textbox', { name: 'Yellow Star quantity, square feet' });
    await user.click(input);
    await user.keyboard('{ArrowUp}{Shift>}{ArrowUp}{/Shift}{ArrowDown}');
    expect(input).toHaveValue('61');
  });

  it('ignores letters typed into a quantity', async () => {
    const user = userEvent.setup();
    renderWithStore(<CartPanel />);
    const input = screen.getByRole('textbox', { name: 'Forest Fern quantity, square feet' });

    await user.clear(input);
    await user.type(input, '1x2');

    expect(input).toHaveValue('12');
  });

  it('removes a line', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<CartPanel />);

    await user.click(screen.getByRole('button', { name: 'Remove Forest Fern from cart' }));

    expect(store.getState().cart.ids).toEqual(['ocean-wave', 'terracotta-dot', 'yellow-star']);
    // 13 100 − 75 × 30
    expect(totals().subtotal).toBe('$10,850.00');
  });

  it('adds a new tile from the picker', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<CartPanel />);

    await user.click(screen.getByRole('button', { name: /add new tile/i }));
    await user.click(screen.getByRole('button', { name: /azure star/i }));

    expect(store.getState().cart.ids.at(-1)).toBe('azure-star');
    expect(screen.getByRole('textbox', { name: 'Azure Star quantity, square feet' })).toHaveValue('10');
  });
});
