import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Cart from './Cart';

const mockedCartHook = vi.hoisted(() => ({
  useCart: vi.fn(),
}));

const mockedThemeHook = vi.hoisted(() => ({
  useTheme: vi.fn(),
}));

vi.mock('../../../context/CartContext', () => mockedCartHook);
vi.mock('../../../context/ThemeContext', () => mockedThemeHook);

describe('Cart page', () => {
  const removeFromCart = vi.fn().mockResolvedValue(undefined);
  const clearCart = vi.fn().mockResolvedValue(undefined);
  const updateQuantity = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockedThemeHook.useTheme.mockReturnValue({ darkMode: false });
    mockedCartHook.useCart.mockReturnValue({
      cartItems: [
        {
          cartItemId: 1,
          productId: 1,
          name: 'SmartFeeder One',
          price: 129.99,
          quantity: 2,
          imgName: 'feeder.png',
          discount: 0.25,
          lineTotal: 194.985,
        },
      ],
      subtotal: 259.98,
      discountTotal: 64.995,
      total: 194.985,
      isSyncing: false,
      syncError: null,
      updateQuantity,
      removeFromCart,
      clearCart,
    });

    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders cart contents and totals', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Your Cart')).not.toBeNull();
    expect(screen.queryByText('SmartFeeder One')).not.toBeNull();
    expect(screen.queryByText('Order Summary')).not.toBeNull();
    expect(screen.queryAllByText('$194.99')).toHaveLength(2);
  });

  it('removes an item after confirmation and shows the checkout placeholder', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove SmartFeeder One' }));
    expect(removeFromCart).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));

    await waitFor(() => {
      expect(screen.queryByText('Checkout is not implemented yet.')).not.toBeNull();
    });
  });
});
