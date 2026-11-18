/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CART_STORAGE_KEY, cartTotals, isCartItem, type ICartItem, type ICartProduct } from './cart';

interface ICartContext {
  items: ICartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  storageError: boolean;
  addItem: (product: ICartProduct, quantity: number) => boolean;
  changeQuantity: (productId: number, change: number) => void;
  removeItem: (productId: number) => void;
}

const CartContext = createContext<ICartContext | null>(null);

function readCart(): ICartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isCartItem)
      || new Set(parsed.map(item => item.productId)).size !== parsed.length) {
      throw new Error('Invalid saved cart data');
    }
    return parsed;
  } catch (error) {
    console.error('Unable to restore cart:', error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>(readCart);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      setStorageError(false);
    } catch (error) {
      console.error('Unable to save cart:', error);
      setStorageError(true);
    }
  }, [items]);

  const addItem = (product: ICartProduct, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity <= 0 || !isCartItem({ ...product, quantity })) {
      console.error('Unable to add invalid product or quantity to cart');
      return false;
    }
    setItems(previous => {
      const existing = previous.find(item => item.productId === product.productId);
      if (existing) {
        return previous.map(item => item.productId === product.productId
          ? { ...product, quantity: item.quantity + quantity }
          : item);
      }
      return [...previous, { ...product, quantity }];
    });
    return true;
  };

  const changeQuantity = (productId: number, change: number) => {
    setItems(previous => previous.map(item => item.productId === productId
      ? { ...item, quantity: Math.max(1, item.quantity + change) }
      : item));
  };

  const removeItem = (productId: number) => {
    setItems(previous => previous.filter(item => item.productId !== productId));
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = cartTotals(items);

  return (
    <CartContext.Provider value={{ items, itemCount, ...totals, storageError, addItem, changeQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
