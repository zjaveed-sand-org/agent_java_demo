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

  if (typeof window !== 'undefined' && typeof window.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const randomToken = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `session-${randomToken}`;
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

const isCartItem = (item: unknown): item is ICartItem => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const candidate = item as Partial<ICartItem>;

  return typeof candidate.cartItemId === 'number'
    && typeof candidate.productId === 'number'
    && typeof candidate.name === 'string'
    && typeof candidate.price === 'number'
    && typeof candidate.quantity === 'number'
    && typeof candidate.imgName === 'string'
    && (typeof candidate.discount === 'number' || candidate.discount === null)
    && typeof candidate.lineTotal === 'number';
};

const getStoredCartState = (sessionId: string): ICartState => {
  const emptyCartState = createEmptyCartState(sessionId);

  if (typeof window === 'undefined') {
    return emptyCartState;
  }

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return emptyCartState;
  }

  try {
    const parsedCart = JSON.parse(storedCart) as Partial<ICartState>;
    if (!Array.isArray(parsedCart.items)) {
      return emptyCartState;
    }
    const validItems = parsedCart.items.filter(isCartItem);

    if (parsedCart.sessionId !== sessionId) {
      return {
        ...emptyCartState,
        items: validItems,
        subtotal: parsedCart.subtotal ?? 0,
        discountTotal: parsedCart.discountTotal ?? 0,
        total: parsedCart.total ?? 0,
        itemCount: validItems.reduce((count, item) => count + item.quantity, 0),
      };
    }

    return {
      ...emptyCartState,
      ...parsedCart,
      items: validItems,
      itemCount: validItems.reduce((count, item) => count + item.quantity, 0),
      sessionId,
    };
  } catch {
    return emptyCartState;
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

  return 'cart:errors.unexpected';
};

const CartContext = createContext<ICartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const sessionId = useMemo(() => getSessionId(), []);
  const [cart, setCart] = useState<ICartState>(() => getStoredCartState(sessionId));
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const initialItemsRef = useRef<ICartItem[]>(cart.items);
  const syncRequestIdRef = useRef(0);

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

  const beginSyncRequest = useCallback(() => {
    const requestId = syncRequestIdRef.current + 1;
    syncRequestIdRef.current = requestId;
    setIsSyncing(true);
    setSyncError(null);
    return requestId;
  }, []);

  const isActiveSyncRequest = useCallback((requestId: number) => syncRequestIdRef.current === requestId, []);

  const finishSyncRequest = useCallback((requestId: number) => {
    if (syncRequestIdRef.current === requestId) {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeCart = async () => {
      const requestId = beginSyncRequest();

      try {
        const serverCart = await fetchCart(sessionId);
        if (cancelled || !isActiveSyncRequest(requestId)) {
          return;
        }

        if (serverCart.items.length === 0 && initialItemsRef.current.length > 0) {
          let hydratedCart = serverCart;
          for (const item of initialItemsRef.current) {
            if (cancelled || !isActiveSyncRequest(requestId)) {
              return;
            }
            hydratedCart = await addCartItem(sessionId, {
              productId: item.productId,
              quantity: item.quantity,
            });
          }

          if (!cancelled && isActiveSyncRequest(requestId)) {
            applyCart(hydratedCart);
          }
          return;
        }

        if (isActiveSyncRequest(requestId)) {
          applyCart(serverCart);
        }
      } catch (error) {
        if (!cancelled && isActiveSyncRequest(requestId)) {
          setSyncError(getErrorMessage(error));
        }
      } finally {
        finishSyncRequest(requestId);
      }
    };

    void initializeCart();

    return () => {
      cancelled = true;
    };
  }, [applyCart, beginSyncRequest, finishSyncRequest, isActiveSyncRequest, sessionId]);

  const addToCart = useCallback(async (product: IProduct, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1.');
    }

    const requestId = beginSyncRequest();

    try {
      const nextCart = await addCartItem(sessionId, {
        productId: product.productId,
        quantity,
      });
      if (isActiveSyncRequest(requestId)) {
        applyCart(nextCart);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      if (isActiveSyncRequest(requestId)) {
        setSyncError(message);
      }
      throw new Error(message);
    } finally {
      finishSyncRequest(requestId);
    }
  }, [applyCart, beginSyncRequest, finishSyncRequest, isActiveSyncRequest, sessionId]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1.');
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (!existingItem) {
      throw new Error('Cart item not found.');
    }

    const requestId = beginSyncRequest();

    try {
      const nextCart = await updateCartItem(sessionId, existingItem.cartItemId, { quantity });
      if (isActiveSyncRequest(requestId)) {
        applyCart(nextCart);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      if (isActiveSyncRequest(requestId)) {
        setSyncError(message);
      }
      throw new Error(message);
    } finally {
      finishSyncRequest(requestId);
    }
  }, [applyCart, beginSyncRequest, cart.items, finishSyncRequest, isActiveSyncRequest, sessionId]);

  const removeFromCart = useCallback(async (productId: number) => {
    const existingItem = cart.items.find((item) => item.productId === productId);
    if (!existingItem) {
      throw new Error('Cart item not found.');
    }

    const requestId = beginSyncRequest();

    try {
      const nextCart = await removeCartItem(sessionId, existingItem.cartItemId);
      if (isActiveSyncRequest(requestId)) {
        applyCart(nextCart);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      if (isActiveSyncRequest(requestId)) {
        setSyncError(message);
      }
      throw new Error(message);
    } finally {
      finishSyncRequest(requestId);
    }
  }, [applyCart, beginSyncRequest, cart.items, finishSyncRequest, isActiveSyncRequest, sessionId]);

  const clearCartItems = useCallback(async () => {
    const requestId = beginSyncRequest();

    try {
      const nextCart = await clearCart(sessionId);
      if (isActiveSyncRequest(requestId)) {
        applyCart(nextCart);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      if (isActiveSyncRequest(requestId)) {
        setSyncError(message);
      }
      throw new Error(message);
    } finally {
      finishSyncRequest(requestId);
    }
  }, [applyCart, beginSyncRequest, finishSyncRequest, isActiveSyncRequest, sessionId]);

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
