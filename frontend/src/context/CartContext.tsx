import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ICartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  discount?: number;
}

interface CartContextType {
  items: ICartItem[];
  addToCart: (item: Omit<ICartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
}

const CART_STORAGE_KEY = 'octocat-cart';

const CartContext = createContext<CartContextType | null>(null);

function loadCartFromStorage(): ICartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown) =>
        item != null &&
        typeof item === 'object' &&
        'productId' in item &&
        'name' in item &&
        'price' in item &&
        'quantity' in item &&
        typeof (item as ICartItem).productId === 'number' &&
        typeof (item as ICartItem).quantity === 'number' &&
        (item as ICartItem).quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Omit<ICartItem, 'quantity'>, quantity: number) => {
    if (quantity <= 0) return;
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.productId !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = item.discount
      ? item.price * (1 - item.discount)
      : item.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
