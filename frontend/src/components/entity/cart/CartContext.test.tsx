import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../../context/CartContext';

function renderCartHook() {
  const result: { current: ReturnType<typeof useCart> | null } = { current: null };

  function Consumer() {
    result.current = useCart();
    return null;
  }

  render(
    <CartProvider>
      <Consumer />
    </CartProvider>
  );

  return result;
}

const productA = {
  productId: 1,
  name: 'Smart Feeder',
  price: 100,
  imgName: 'feeder.png',
};

const productB = {
  productId: 2,
  name: 'Cat Cam',
  price: 50,
  discount: 0.2,
  imgName: 'cam.png',
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const cart = renderCartHook();
    expect(cart.current?.items).toHaveLength(0);
    expect(cart.current?.totalItems).toBe(0);
    expect(cart.current?.subtotal).toBe(0);
  });

  it('adds multiple products and keeps them', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 2));
    act(() => cart.current?.addToCart(productB, 1));

    expect(cart.current?.items).toHaveLength(2);
    expect(cart.current?.totalItems).toBe(3);
    // 100*2 + (50 * 0.8)*1 = 200 + 40 = 240
    expect(cart.current?.subtotal).toBe(240);
  });

  it('merges quantity when the same product is added again', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 2));
    act(() => cart.current?.addToCart(productA, 3));

    expect(cart.current?.items).toHaveLength(1);
    expect(cart.current?.items[0].quantity).toBe(5);
  });

  it('ignores non-positive quantities on add', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 0));

    expect(cart.current?.items).toHaveLength(0);
  });

  it('updates item quantity directly', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 1));
    act(() => cart.current?.updateQuantity(productA.productId, 4));

    expect(cart.current?.items[0].quantity).toBe(4);
    expect(cart.current?.totalItems).toBe(4);
  });

  it('removes the item when quantity is updated to zero or below', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 1));
    act(() => cart.current?.updateQuantity(productA.productId, 0));

    expect(cart.current?.items).toHaveLength(0);
  });

  it('removes an item directly', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 1));
    act(() => cart.current?.addToCart(productB, 1));
    act(() => cart.current?.removeFromCart(productA.productId));

    expect(cart.current?.items).toHaveLength(1);
    expect(cart.current?.items[0].productId).toBe(productB.productId);
  });

  it('clears the cart', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 1));
    act(() => cart.current?.clearCart());

    expect(cart.current?.items).toHaveLength(0);
  });

  it('persists to localStorage', () => {
    const cart = renderCartHook();

    act(() => cart.current?.addToCart(productA, 2));

    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ productId: 1, quantity: 2 });
  });

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...productA, quantity: 3 }])
    );

    const cart = renderCartHook();

    expect(cart.current?.items).toHaveLength(1);
    expect(cart.current?.totalItems).toBe(3);
  });

  it('throws when useCart is used outside a provider', () => {
    function Orphan() {
      useCart();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(
      'useCart must be used within a CartProvider'
    );
  });
});

describe('Cart totals rendering', () => {
  it('reflects updated totals in a consumer', () => {
    localStorage.clear();
    let snapshot = 0;

    function Display() {
      const { subtotal } = useCart();
      snapshot = subtotal;
      return <span>{subtotal}</span>;
    }

    render(
      <CartProvider>
        <Display />
      </CartProvider>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(snapshot).toBe(0);
  });
});
