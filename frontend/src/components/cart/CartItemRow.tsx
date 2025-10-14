import { useCart, CartItem } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

// ============================================================================
// Type Definitions / Typdefinitionen
// ============================================================================

/**
 * Props for the CartItemRow component
 * Props für die CartItemRow-Komponente
 */
interface CartItemRowProps {
  /** Cart item containing product and quantity / Warenkorb-Element mit Produkt und Menge */
  item: CartItem;
}

// ============================================================================
// Helper Functions / Hilfsfunktionen
// ============================================================================

/**
 * Calculate the effective price of a product after applying discount
 * Berechnet den effektiven Preis eines Produkts nach Anwendung des Rabatts
 * 
 * @param price - Original product price / Ursprünglicher Produktpreis
 * @param discount - Discount percentage (0-1) / Rabattanteil (0-1)
 * @returns Effective price after discount / Effektiver Preis nach Rabatt
 */
const getEffectivePrice = (price: number, discount?: number): number => {
  if (discount && discount > 0) {
    return price * (1 - discount);
  }
  return price;
};

/**
 * Format price to display with 2 decimal places and dollar sign
 * Formatiert Preis zur Anzeige mit 2 Dezimalstellen und Dollarzeichen
 * 
 * @param price - Price to format / Zu formatierender Preis
 * @returns Formatted price string / Formatierter Preis-String
 */
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// ============================================================================
// Component / Komponente
// ============================================================================

/**
 * CartItemRow - Displays a single cart item in a horizontal media row layout
 * CartItemRow - Zeigt ein einzelnes Warenkorb-Element in einem horizontalen Medien-Row-Layout
 * 
 * This component displays a cart item with:
 * - Thumbnail image on the left
 * - Product details (title, price) in the center
 * - Quantity controls (-, quantity, +)
 * - Line total (quantity × effective price)
 * - Remove button (trash icon) on the right
 * 
 * Diese Komponente zeigt ein Warenkorb-Element mit:
 * - Vorschaubild auf der linken Seite
 * - Produktdetails (Titel, Preis) in der Mitte
 * - Mengensteuerung (-, Menge, +)
 * - Zeilensumme (Menge × effektiver Preis)
 * - Entfernen-Button (Papierkorb-Symbol) auf der rechten Seite
 * 
 * Features / Funktionen:
 * - Responsive design: stacks vertically on small screens, horizontal on medium+
 *   Responsives Design: stapelt vertikal auf kleinen Bildschirmen, horizontal auf mittel+
 * - Shows original price with strikethrough if discount exists
 *   Zeigt Originalpreis durchgestrichen an, wenn Rabatt vorhanden ist
 * - Keyboard accessible quantity controls with ARIA labels
 *   Tastaturzugängliche Mengensteuerung mit ARIA-Labels
 * - Dark mode support / Dark-Mode-Unterstützung
 * - Integrates with CartContext for state management
 *   Integriert mit CartContext für Zustandsverwaltung
 * 
 * @param props - Component props / Komponenten-Props
 * @returns React component / React-Komponente
 */
export default function CartItemRow({ item }: CartItemRowProps) {
  // ============================================================================
  // Hooks / Hooks
  // ============================================================================

  /**
   * Get cart functions from CartContext
   * Hole Warenkorb-Funktionen aus CartContext
   */
  const { updateQuantity, removeFromCart } = useCart();

  /**
   * Get theme state for dark mode styling
   * Hole Theme-Zustand für Dark-Mode-Styling
   */
  const { darkMode } = useTheme();

  // ============================================================================
  // Computed Values / Berechnete Werte
  // ============================================================================

  const { product, quantity } = item;
  const effectivePrice = getEffectivePrice(product.price, product.discount);
  const lineTotal = effectivePrice * quantity;
  const hasDiscount = product.discount && product.discount > 0;

  // ============================================================================
  // Event Handlers / Event-Handler
  // ============================================================================

  /**
   * Handle quantity increment
   * Behandelt Mengenerhöhung
   */
  const handleIncrement = () => {
    updateQuantity(product.productId, quantity + 1);
  };

  /**
   * Handle quantity decrement
   * Behandelt Mengenverringerung
   * 
   * If quantity becomes 0, the item will be removed from cart automatically
   * by the CartContext's updateQuantity function.
   * 
   * Wenn die Menge 0 wird, wird das Element automatisch aus dem Warenkorb
   * entfernt durch die updateQuantity-Funktion des CartContext.
   */
  const handleDecrement = () => {
    updateQuantity(product.productId, quantity - 1);
  };

  /**
   * Handle remove item from cart
   * Behandelt Entfernen des Elements aus dem Warenkorb
   */
  const handleRemove = () => {
    removeFromCart(product.productId);
  };

  // ============================================================================
  // Dynamic Styling / Dynamisches Styling
  // ============================================================================

  /**
   * Dynamic classes based on theme for container
   * Dynamische Klassen basierend auf Theme für Container
   */
  const containerClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  /**
   * Dynamic classes for text elements
   * Dynamische Klassen für Textelemente
   */
  const textPrimaryClasses = darkMode ? 'text-light' : 'text-gray-900';
  const textSecondaryClasses = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textMutedClasses = darkMode ? 'text-gray-500' : 'text-gray-500';

  /**
   * Dynamic classes for buttons
   * Dynamische Klassen für Buttons
   */
  const buttonClasses = darkMode
    ? 'bg-gray-700 text-light hover:bg-gray-600 border-gray-600'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';

  const removeButtonClasses = darkMode
    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
    : 'text-gray-500 hover:text-red-500 hover:bg-gray-100';

  // ============================================================================
  // Render / Rendern
  // ============================================================================

  return (
    <div
      className={`
        ${containerClasses}
        border rounded-lg p-4
        flex flex-col sm:flex-row
        gap-4
        transition-colors duration-300
      `}
      role="article"
      aria-label={`Cart item: ${product.name}`}
    >
      {/* 
        Thumbnail Image Container
        Vorschaubild-Container
        
        Displays product thumbnail on the left (or top on mobile).
        Uses object-cover to maintain aspect ratio.
        
        Zeigt Produktvorschau links (oder oben auf Mobilgeräten).
        Verwendet object-cover, um Seitenverhältnis beizubehalten.
      */}
      <div className="flex-shrink-0 w-full sm:w-24 h-24">
        <img
          src={product.imgName || '/placeholder-product.png'}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      </div>

      {/* 
        Main Content Container
        Hauptinhalt-Container
        
        Contains product details, quantity controls, and pricing.
        Grows to fill available space.
        
        Enthält Produktdetails, Mengensteuerung und Preisangaben.
        Wächst, um verfügbaren Platz zu füllen.
      */}
      <div className="flex-grow flex flex-col sm:flex-row gap-4 sm:items-center">
        {/* 
          Product Details Section
          Produktdetails-Bereich
          
          Shows product name and pricing information.
          Zeigt Produktname und Preisinformationen.
        */}
        <div className="flex-grow min-w-0">
          <h3 className={`${textPrimaryClasses} font-semibold text-lg mb-1 truncate`}>
            {product.name}
          </h3>
          
          {/* 
            Price Display
            Preisanzeige
            
            Shows original price with strikethrough if discount exists,
            followed by the discounted price. Otherwise shows regular price.
            
            Zeigt Originalpreis durchgestrichen an, wenn Rabatt existiert,
            gefolgt vom Rabattpreis. Andernfalls wird regulärer Preis angezeigt.
          */}
          <div className="flex items-center gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <span className={`${textMutedClasses} line-through text-sm`}>
                  {formatPrice(product.price)}
                </span>
                <span className={`${textSecondaryClasses} font-medium`}>
                  {formatPrice(effectivePrice)}
                </span>
                <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {Math.round((product.discount || 0) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className={`${textSecondaryClasses} font-medium`}>
                {formatPrice(product.price)}
              </span>
            )}
            <span className={`${textSecondaryClasses} text-sm`}>
              / {product.unit}
            </span>
          </div>
        </div>

        {/* 
          Quantity Controls Section
          Mengensteuerungs-Bereich
          
          Contains decrement button, quantity display, and increment button.
          All controls are keyboard accessible with proper ARIA labels.
          
          Enthält Verringerungsbutton, Mengenanzeige und Erhöhungsbutton.
          Alle Steuerelemente sind tastaturzugänglich mit geeigneten ARIA-Labels.
        */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className={`
              ${buttonClasses}
              w-8 h-8 rounded-md
              flex items-center justify-center
              border
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
            `}
            aria-label={`Decrease quantity of ${product.name}`}
            disabled={quantity <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>

          <span
            className={`${textPrimaryClasses} font-semibold min-w-[2rem] text-center`}
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>

          <button
            onClick={handleIncrement}
            className={`
              ${buttonClasses}
              w-8 h-8 rounded-md
              flex items-center justify-center
              border
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
            `}
            aria-label={`Increase quantity of ${product.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* 
          Line Total Section
          Zeilensummen-Bereich
          
          Displays the total for this line item (quantity × effective price).
          Prominent display to show the calculated cost.
          
          Zeigt die Summe für diesen Zeileneintrag (Menge × effektiver Preis).
          Hervorgehobene Anzeige, um die berechneten Kosten zu zeigen.
        */}
        <div className="sm:text-right min-w-[5rem]">
          <div className={`${textPrimaryClasses} font-bold text-lg`}>
            {formatPrice(lineTotal)}
          </div>
          <div className={`${textSecondaryClasses} text-xs`}>
            Total / Gesamt
          </div>
        </div>
      </div>

      {/* 
        Remove Button Section
        Entfernen-Button-Bereich
        
        Trash icon button to remove the item from cart.
        Aligned to the end (right on desktop, bottom-right on mobile).
        
        Papierkorb-Symbol-Button zum Entfernen des Elements aus dem Warenkorb.
        Am Ende ausgerichtet (rechts auf Desktop, unten rechts auf Mobilgeräten).
      */}
      <div className="flex sm:flex-col justify-end items-center sm:items-end">
        <button
          onClick={handleRemove}
          className={`
            ${removeButtonClasses}
            p-2 rounded-md
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
          `}
          aria-label={`Remove ${product.name} from cart`}
          title="Remove from cart"
        >
          {/* 
            Trash Icon SVG
            Papierkorb-Symbol SVG
            
            Standard trash/delete icon for removing items.
            Standardmäßiges Papierkorb-/Löschen-Symbol zum Entfernen von Elementen.
          */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
