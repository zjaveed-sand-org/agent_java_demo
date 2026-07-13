import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import { ICartState } from '../types/cart';
import { IProduct } from '../types/product';

const mockedCartApi = vi.hoisted(() => ({
  fetchCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
}));

vi.mock('../api/cart', () => mockedCartApi);

const sessionId = 'test-session';

const product: IProduct = {
  productId: 1,
  supplierId: 3,
  name: 'SmartFeeder One',
  description: 'Feeder',
  price: 129.99,
  imgName: 'feeder.png',
  sku: 'SKU-1',
  unit: 'piece',
  discount: 0.25,
};

const emptyCart = (): ICartState => ({
  sessionId,
  cartId: `cart-${sessionId}`,
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:00:00Z',
  items: [],
  subtotal: 0,
  discountTotal: 0,
  total: 0,
  itemCount: 0,
});

const populatedCart = (quantity: number): ICartState => ({
  sessionId,
  cartId: `cart-${sessionId}`,
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:05:00Z',
  items: [
    {
      cartItemId: 1,
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity,
      imgName: product.imgName,
      discount: product.discount,
      lineTotal: 97.4925 * quantity,
    },
  ],
  subtotal: 129.99 * quantity,
  discountTotal: 32.4975 * quantity,
  total: 97.4925 * quantity,
  itemCount: quantity,
});

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });

  return { promise, resolve };
};

function CartConsumer() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemCount, getCartTotal } = useCart();

  return (
    <div>
      <span data-testid="count">{getCartItemCount()}</span>
      <span data-testid="total">{getCartTotal()}</span>
      <span data-testid="items-length">{cartItems.length}</span>
      <button type="button" onClick={() => void addToCart(product, 2)}>add</button>
      <button type="button" onClick={() => void updateQuantity(product.productId, 3)}>update</button>
      <button type="button" onClick={() => void removeFromCart(product.productId)}>remove</button>
      <button type="button" onClick={() => void clearCart()}>clear</button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('octocat-cart-session-id', sessionId);
    mockedCartApi.fetchCart.mockResolvedValue(emptyCart());
    mockedCartApi.addCartItem.mockResolvedValue(populatedCart(2));
    mockedCartApi.updateCartItem.mockResolvedValue(populatedCart(3));
    mockedCartApi.removeCartItem.mockResolvedValue(emptyCart());
    mockedCartApi.clearCart.mockResolvedValue(emptyCart());
  });

  it('adds items to the cart and persists the latest cart state', async () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    fireEvent.click(screen.getByText('add'));

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    const storedCart = window.localStorage.getItem('octocat-cart-state');
    expect(storedCart).not.toBeNull();
    expect(storedCart).toContain('"itemCount":2');
  });

  it('keeps the new session metadata when restoring cart items from a different session', async () => {
    window.localStorage.setItem('octocat-cart-session-id', sessionId);
    window.localStorage.setItem('octocat-cart-state', JSON.stringify({
      ...populatedCart(1),
      sessionId: 'stale-session',
      cartId: 'cart-stale-session',
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    }));

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await waitFor(() => {
      const storedCart = JSON.parse(window.localStorage.getItem('octocat-cart-state') ?? '{}') as ICartState;
      expect(storedCart.sessionId).toBe(sessionId);
      expect(storedCart.cartId).toBe(`cart-${sessionId}`);
      expect(storedCart.createdAt).not.toBe('2026-07-01T00:00:00Z');
      expect(storedCart.updatedAt).not.toBe('2026-07-01T00:00:00Z');
    });
  });

  it('filters invalid stored cart items before restoring state', async () => {
    window.localStorage.setItem('octocat-cart-state', JSON.stringify({
      ...emptyCart(),
      itemCount: 9,
      items: [
        populatedCart(1).items[0],
        { productId: 'bad-data', quantity: 5 },
      ],
    }));

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });
  });

  it('updates item quantities through the shared context', async () => {
    mockedCartApi.fetchCart.mockResolvedValue(populatedCart(2));

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    fireEvent.click(screen.getByText('update'));

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('3');
    });
  });

  it('does not let the initial fetch overwrite a newer mutation result', async () => {
    const deferredFetch = createDeferred<ICartState>();
    mockedCartApi.fetchCart.mockReturnValue(deferredFetch.promise);

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    fireEvent.click(screen.getByText('add'));

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    await act(async () => {
      deferredFetch.resolve(emptyCart());
      await deferredFetch.promise;
    });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });
  });

  it('removes items from the cart', async () => {
    mockedCartApi.fetchCart.mockResolvedValue(populatedCart(1));

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    fireEvent.click(screen.getByText('remove'));

    await waitFor(() => {
      expect(screen.getByTestId('items-length').textContent).toBe('0');
    });
  });

  it('clears the cart', async () => {
    mockedCartApi.fetchCart.mockResolvedValue(populatedCart(1));

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
    });

    fireEvent.click(screen.getByText('clear'));

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('0');
      expect(screen.getByTestId('total').textContent).toBe('0');
    });
  });
});
