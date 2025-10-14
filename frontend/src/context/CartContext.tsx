import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// Type Definitions / Typdefinitionen
// ============================================================================

/**
 * Product interface representing an item in the catalog
 * Produkt-Schnittstelle, die einen Artikel im Katalog darstellt
 */
export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number; // Optional discount percentage (0-1) / Optionaler Rabattanteil (0-1)
}

/**
 * CartItem interface representing a product and its quantity in the cart
 * Warenkorb-Element-Schnittstelle, die ein Produkt und seine Menge im Warenkorb darstellt
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * CartContext type definition with state and functions
 * CartContext-Typdefinition mit Zustand und Funktionen
 */
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

// ============================================================================
// Context Creation / Context-Erstellung
// ============================================================================

const CartContext = createContext<CartContextType | null>(null);

// ============================================================================
// Constants / Konstanten
// ============================================================================

/**
 * Business rules for shipping calculation
 * Geschäftsregeln für die Versandkostenberechnung
 */
const FREE_SHIPPING_THRESHOLD = 50; // Free shipping when subtotal >= $50 / Kostenloser Versand bei Zwischensumme >= $50
const STANDARD_SHIPPING_COST = 5.99; // Standard shipping cost / Standard-Versandkosten
const CART_STORAGE_KEY = 'cart'; // localStorage key for cart persistence / localStorage-Schlüssel für Warenkorb-Persistenz

// ============================================================================
// Helper Functions / Hilfsfunktionen
// ============================================================================

/**
 * Calculate the effective price of a product after applying discount
 * Berechnet den effektiven Preis eines Produkts nach Anwendung des Rabatts
 * 
 * @param product - Product with price and optional discount
 * @returns Effective price after discount
 */
const getEffectivePrice = (product: Product): number => {
  if (product.discount && product.discount > 0) {
    // Apply discount: price * (1 - discount)
    // Rabatt anwenden: Preis * (1 - Rabatt)
    return product.price * (1 - product.discount);
  }
  return product.price;
};

/**
 * Load cart items from localStorage
 * Lädt Warenkorb-Elemente aus dem localStorage
 * 
 * @returns Array of cart items or empty array if none found
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart) as CartItem[];
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

/**
 * Save cart items to localStorage
 * Speichert Warenkorb-Elemente im localStorage
 * 
 * @param items - Array of cart items to save
 */
const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// ============================================================================
// Provider Component / Provider-Komponente
// ============================================================================

/**
 * CartProvider component that manages cart state and provides cart functionality
 * CartProvider-Komponente, die den Warenkorb-Zustand verwaltet und Warenkorb-Funktionalität bereitstellt
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart state from localStorage / Initialisiere Warenkorb-Zustand aus localStorage
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // ============================================================================
  // Side Effects / Seiteneffekte
  // ============================================================================

  /**
   * Effect to persist cart changes to localStorage
   * Effekt zum Speichern von Warenkorb-Änderungen im localStorage
   */
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // ============================================================================
  // Cart Functions / Warenkorb-Funktionen
  // ============================================================================

  /**
   * Add a product to the cart or update quantity if already exists
   * Fügt ein Produkt zum Warenkorb hinzu oder aktualisiert die Menge, falls bereits vorhanden
   * 
   * @param product - Product to add
   * @param quantity - Quantity to add (default: 1)
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      // Check if product already exists in cart / Prüfe, ob Produkt bereits im Warenkorb ist
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.productId === product.productId
      );

      if (existingItemIndex > -1) {
        // Product exists, update quantity / Produkt existiert, aktualisiere Menge
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Product doesn't exist, add new item / Produkt existiert nicht, füge neues Element hinzu
        return [...prevItems, { product, quantity }];
      }
    });
  };

  /**
   * Remove a product from the cart
   * Entfernt ein Produkt aus dem Warenkorb
   * 
   * @param productId - ID of the product to remove
   */
  const removeFromCart = (productId: number) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.product.productId !== productId)
    );
  };

  /**
   * Update the quantity of a product in the cart
   * Aktualisiert die Menge eines Produkts im Warenkorb
   * 
   * @param productId - ID of the product to update
   * @param quantity - New quantity (item will be removed if quantity <= 0)
   */
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative / Entferne Element, wenn Menge 0 oder negativ ist
      removeFromCart(productId);
    } else {
      setItems((prevItems) => 
        prevItems.map((item) =>
          item.product.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  /**
   * Clear all items from the cart
   * Löscht alle Elemente aus dem Warenkorb
   */
  const clearCart = () => {
    setItems([]);
  };

  // ============================================================================
  // Computed Values / Berechnete Werte
  // ============================================================================

  /**
   * Calculate total number of items in cart
   * Berechnet die Gesamtanzahl der Artikel im Warenkorb
   */
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  /**
   * Calculate subtotal (sum of all item prices after discount)
   * Berechnet die Zwischensumme (Summe aller Artikelpreise nach Rabatt)
   */
  const subtotal = items.reduce((total, item) => {
    const effectivePrice = getEffectivePrice(item.product);
    return total + (effectivePrice * item.quantity);
  }, 0);

  /**
   * Calculate shipping cost based on business rules
   * Berechnet die Versandkosten basierend auf Geschäftsregeln
   * 
   * Rules / Regeln:
   * - Free shipping if subtotal >= $50 / Kostenloser Versand bei Zwischensumme >= $50
   * - Standard shipping $5.99 otherwise / Andernfalls Standard-Versand $5.99
   */
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

  /**
   * Calculate total (subtotal + shipping)
   * Berechnet die Gesamtsumme (Zwischensumme + Versand)
   */
  const total = subtotal + shipping;

  // ============================================================================
  // Context Value / Context-Wert
  // ============================================================================

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================================
// Custom Hook / Benutzerdefinierter Hook
// ============================================================================

/**
 * Custom hook to access cart context
 * Benutzerdefinierter Hook für Zugriff auf den Warenkorb-Context
 * 
 * @throws Error if used outside of CartProvider
 * @returns CartContext value with cart state and functions
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
