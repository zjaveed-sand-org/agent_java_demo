// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import i18n from '../i18n';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { CART_STORAGE_KEY, cartTotals, type ICartItem } from '../context/cart';
import { ThemeProvider } from '../context/ThemeContext';
import Navigation from './Navigation';
import Cart from './Cart';
import Products from './entity/product/Products';

const product = {
  productId: 1,
  name: 'Smart Feeder',
  description: 'A feeder',
  price: 99.99,
  discount: 0.25,
  imgName: 'feeder.png',
  sku: 'FEEDER',
  unit: 'piece',
  supplierId: 1,
};

function renderStore(route = '/products') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <MemoryRouter initialEntries={[route]}>
              <Navigation />
              <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </MemoryRouter>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  localStorage.clear();
  await i18n.changeLanguage('en');
  vi.spyOn(axios, 'get').mockResolvedValue({ data: [product] });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('cart', () => {
  it('adds and combines products, calculates discounted totals, persists, and edits quantities', async () => {
    const view = renderStore();
    await screen.findByText('Smart Feeder');
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity of Smart Feeder' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 1 Smart Feeder to cart' }));
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity of Smart Feeder' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add 1 Smart Feeder to cart' }));
    fireEvent.click(screen.getByRole('link', { name: 'Cart, 2 items' }));

    expect(screen.getAllByText('$149.98')).toHaveLength(3);
    expect(within(screen.getByRole('region', { name: 'Order summary' })).getByText('Free')).toBeTruthy();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')).toHaveLength(1));
    view.unmount();

    renderStore('/cart');
    expect(screen.getByLabelText('Quantity of Smart Feeder').textContent).toBe('2');
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity of Smart Feeder' }));
    expect(screen.getByLabelText('Quantity of Smart Feeder').textContent).toBe('1');
    expect(screen.getByText('$99.99')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Smart Feeder' }));
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null')).toEqual([]));
  });

  it('applies the shipping boundary to the discounted subtotal, including free products', () => {
    const item: ICartItem = { ...product, price: 100, discount: 0, quantity: 1 };
    expect(cartTotals([])).toEqual({ subtotal: 0, shipping: 0, total: 0 });
    expect(cartTotals([item])).toEqual({ subtotal: 10000, shipping: 2500, total: 12500 });
    expect(cartTotals([{ ...item, price: 100.01 }])).toEqual({ subtotal: 10001, shipping: 0, total: 10001 });
    expect(cartTotals([{ ...item, price: 0 }])).toEqual({ subtotal: 0, shipping: 2500, total: 2500 });
    expect(cartTotals([{ ...item, price: 100.01, discount: 0.25 }])).toEqual({
      subtotal: 7501, shipping: 2500, total: 10001,
    });
  });

  it('shows a warning when browser storage is unavailable', async () => {
    const setItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === CART_STORAGE_KEY) {
        throw new Error('Storage disabled');
      }
      return setItem.call(this, key, value);
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderStore('/cart');
    expect(await screen.findByRole('alert')).toHaveProperty('textContent',
      'Your cart could not be saved in this browser. Changes may be lost when you leave.');
  });

  it('recovers from invalid stored cart data', async () => {
    localStorage.setItem(CART_STORAGE_KEY, '{"invalid":true}');
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderStore('/cart');
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    expect(logError).toHaveBeenCalled();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null')).toEqual([]));
  });

  it('switches cart text when the visitor changes language', async () => {
    renderStore('/cart');
    fireEvent.change(screen.getByLabelText('Cart language'), { target: { value: 'de' } });
    expect(await screen.findByRole('heading', { name: 'Ihr Warenkorb' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Sprache des Warenkorbs'), { target: { value: 'es' } });
    expect(await screen.findByRole('heading', { name: 'Tu carrito' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Idioma del carrito'), { target: { value: 'zh' } });
    expect(await screen.findByRole('heading', { name: '您的购物车' })).toBeTruthy();
  });
});
