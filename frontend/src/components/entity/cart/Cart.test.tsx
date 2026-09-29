import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartProvider } from '../../../context/CartContext';
import { ThemeProvider } from '../../../context/ThemeContext';

function seedCart(items: unknown[]) {
  localStorage.setItem('cart', JSON.stringify(items));
}

function renderCart() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <CartProvider>
          <Cart />
        </CartProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

const feeder = {
  productId: 1,
  name: 'Smart Feeder',
  price: 100,
  imgName: 'feeder.png',
  quantity: 2,
};

describe('Cart page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows an empty state with a continue shopping link', () => {
    renderCart();

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue Shopping' })).toBeInTheDocument();
  });

  it('renders items with a structured view and totals', () => {
    seedCart([feeder]);
    renderCart();

    expect(screen.getByText('Smart Feeder')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    // subtotal 100 * 2 = 200
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$200.00');
  });

  it('increases quantity and updates the subtotal', async () => {
    const user = userEvent.setup();
    seedCart([feeder]);
    renderCart();

    await user.click(screen.getByLabelText('Increase quantity of Smart Feeder'));

    expect(screen.getByLabelText('Quantity of Smart Feeder')).toHaveTextContent('3');
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$300.00');
  });

  it('removes an item and shows the empty state', async () => {
    const user = userEvent.setup();
    seedCart([feeder]);
    renderCart();

    await user.click(screen.getByLabelText('Remove Smart Feeder from cart'));

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('clears the cart', async () => {
    const user = userEvent.setup();
    seedCart([feeder, { ...feeder, productId: 2, name: 'Cat Cam' }]);
    renderCart();

    await user.click(screen.getByText('Clear cart'));

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('offers a checkout button', () => {
    seedCart([feeder]);
    renderCart();

    expect(screen.getByRole('button', { name: 'Proceed to Checkout' })).toBeInTheDocument();
  });
});
