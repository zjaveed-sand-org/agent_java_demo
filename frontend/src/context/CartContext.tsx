/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { addCartItem, clearCart, fetchCart, removeCartItem, updateCartItem } from '../api/cart';
import { createEmptyCartState, ICartItem, ICartState } from '../types/cart';
import { IProduct } from '../types/product';

interface ICartContextType {
  cartItems: ICartItem[];
  cartId: string;
  sessionId: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  isSyncing: boolean;
  syncError: string | null;
  addToCart: (product: IProduct, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CART_STORAGE_KEY = 'octocat-cart-state';
const SESSION_STORAGE_KEY = 'octocat-cart-session-id';

const createSessionId = (): string => {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `session-${Date.now()}`;
};

const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const storedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (storedSessionId) {
    return storedSessionId;
  }

  const sessionId = createSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
};

const getStoredCartState = (sessionId: string): ICartState => {
  if (typeof window === 'undefined') {
    return createEmptyCartState(sessionId);
  }

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return createEmptyCartState(sessionId);
  }

  try {
    const parsedCart = JSON.parse(storedCart) as Partial<ICartState>;
    if (!Array.isArray(parsedCart.items)) {
      return createEmptyCartState(sessionId);
    }

    return {
      ...createEmptyCartState(sessionId),
      ...parsedCart,
      sessionId,
    };
  } catch {
    return createEmptyCartState(sessionId);
  }
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && typeof error.response?.data === 'object' && error.response?.data) {
    const maybeMessage = (error.response.data as { message?: string }).message;
    if (maybeMessage) {
      return maybeMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected cart error';
};

const CartContext = createContext<ICartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const sessionId = useMemo(() => getSessionId(), []);
  const [cart, setCart] = useState<ICartState>(() => getStoredCartState(sessionId));
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const initialItemsRef = useRef<ICartItem[]>(cart.items);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const applyCart = useCallback((nextCart: ICartState) => {
    setCart({
      ...nextCart,
      sessionId,
    });
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    const initializeCart = async () => {
      setIsSyncing(true);
      setSyncError(null);

      try {
        const serverCart = await fetchCart(sessionId);
        if (cancelled) {
          return;
        }

        if (serverCart.items.length === 0 && initialItemsRef.current.length > 0) {
          let hydratedCart = serverCart;
          for (const item of initialItemsRef.current) {
            hydratedCart = await addCartItem(sessionId, {
              productId: item.productId,
              quantity: item.quantity,
            });
          }

          if (!cancelled) {
            applyCart(hydratedCart);
          }
          return;
        }

        applyCart(serverCart);
      } catch (error) {
        if (!cancelled) {
          setSyncError(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsSyncing(false);
        }
      }
    };

    void initializeCart();

    return () => {
      cancelled = true;
    };
  }, [applyCart, sessionId]);

  const addToCart = useCallback(async (product: IProduct, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1.');
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const nextCart = await addCartItem(sessionId, {
        productId: product.productId,
        quantity,
      });
      applyCart(nextCart);
    } catch (error) {
      const message = getErrorMessage(error);
      setSyncError(message);
      throw new Error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [applyCart, sessionId]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1.');
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (!existingItem) {
      throw new Error('Cart item not found.');
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const nextCart = await updateCartItem(sessionId, existingItem.cartItemId, { quantity });
      applyCart(nextCart);
    } catch (error) {
      const message = getErrorMessage(error);
      setSyncError(message);
      throw new Error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [applyCart, cart.items, sessionId]);

  const removeFromCart = useCallback(async (productId: number) => {
    const existingItem = cart.items.find((item) => item.productId === productId);
    if (!existingItem) {
      throw new Error('Cart item not found.');
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const nextCart = await removeCartItem(sessionId, existingItem.cartItemId);
      applyCart(nextCart);
    } catch (error) {
      const message = getErrorMessage(error);
      setSyncError(message);
      throw new Error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [applyCart, cart.items, sessionId]);

  const clearCartItems = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const nextCart = await clearCart(sessionId);
      applyCart(nextCart);
    } catch (error) {
      const message = getErrorMessage(error);
      setSyncError(message);
      throw new Error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [applyCart, sessionId]);

  const contextValue = useMemo<ICartContextType>(() => ({
    cartItems: cart.items,
    cartId: cart.cartId,
    sessionId,
    subtotal: cart.subtotal,
    discountTotal: cart.discountTotal,
    total: cart.total,
    isSyncing,
    syncError,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartItems,
    getCartTotal: () => cart.total,
    getCartItemCount: () => cart.itemCount,
  }), [
    addToCart,
    cart.cartId,
    cart.discountTotal,
    cart.items,
    cart.subtotal,
    cart.total,
    cart.itemCount,
    clearCartItems,
    isSyncing,
    removeFromCart,
    sessionId,
    syncError,
    updateQuantity,
  ]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
