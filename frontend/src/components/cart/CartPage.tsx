import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItemRow from './CartItemRow';
import CartSummaryPanel from './CartSummaryPanel';

// ============================================================================
// Component / Komponente
// ============================================================================

/**
 * CartPage - Main shopping cart page component
 * CartPage - Hauptkomponente der Warenkorb-Seite
 * 
 * This component displays the complete shopping cart experience with:
 * - Page heading "Shopping Cart" / Seitenüberschrift "Warenkorb"
 * - Two-column layout on large screens / Zwei-Spalten-Layout auf großen Bildschirmen
 *   - Left column: List of cart items using CartItemRow (stacked media rows)
 *     Linke Spalte: Liste der Warenkorb-Artikel mit CartItemRow (gestapelte Medien-Zeilen)
 *   - Right column: CartSummaryPanel (320px wide, sticky)
 *     Rechte Spalte: CartSummaryPanel (320px breit, sticky)
 * - Empty state when cart is empty / Leerzustand wenn Warenkorb leer ist
 *   - Empty cart icon (SVG) / Leerer Warenkorb-Symbol (SVG)
 *   - Message "Your cart is empty" / Nachricht "Ihr Warenkorb ist leer"
 *   - Call-to-action button to navigate to /products
 *     Call-to-Action-Button zur Navigation zu /products
 * 
 * Diese Komponente zeigt die vollständige Warenkorb-Erfahrung mit:
 * - Seitenüberschrift "Warenkorb"
 * - Zwei-Spalten-Layout auf großen Bildschirmen
 *   - Linke Spalte: Liste der Warenkorb-Artikel
 *   - Rechte Spalte: Bestellübersicht (320px breit, sticky)
 * - Leerzustand wenn Warenkorb leer ist
 * 
 * Layout Details / Layout-Details:
 * - Uses CSS Grid with `lg:grid-cols-[1fr_320px]` for large screens
 *   Verwendet CSS Grid mit `lg:grid-cols-[1fr_320px]` für große Bildschirme
 * - Stacks vertically on small screens / Stapelt vertikal auf kleinen Bildschirmen
 * - Top padding of 20 (80px) for navigation clearance
 *   Oberer Abstand von 20 (80px) für Navigationsspielraum
 * - Gap between columns for visual separation / Abstand zwischen Spalten für visuelle Trennung
 * - Sticky summary panel stays visible while scrolling on large screens
 *   Sticky-Zusammenfassungs-Panel bleibt beim Scrollen auf großen Bildschirmen sichtbar
 * - Sticky panel doesn't overlap footer on short pages (self-start alignment)
 *   Sticky-Panel überlappt nicht die Fußzeile auf kurzen Seiten (self-start Ausrichtung)
 * 
 * Features / Funktionen:
 * - Responsive design: full mobile support / Responsives Design: vollständige Mobile-Unterstützung
 * - Dark mode support with smooth transitions / Dark-Mode-Unterstützung mit sanften Übergängen
 * - Empty state with friendly message and navigation CTA
 *   Leerzustand mit freundlicher Nachricht und Navigations-CTA
 * - Keyboard accessible empty state button / Tastaturzugänglicher Leerzustands-Button
 * - Integrates with useCart hook for cart state / Integriert mit useCart Hook für Warenkorb-Zustand
 * - Integrates with useTheme hook for dark mode / Integriert mit useTheme Hook für Dark-Mode
 * - Uses React Router's useNavigate for navigation / Verwendet React Router's useNavigate für Navigation
 * 
 * Accessibility / Barrierefreiheit:
 * - Proper ARIA labels and semantic HTML / Geeignete ARIA-Labels und semantisches HTML
 * - Focus management for interactive elements / Fokus-Verwaltung für interaktive Elemente
 * - Screen reader friendly empty state messages / Bildschirmleser-freundliche Leerzustands-Nachrichten
 * 
 * @returns React component / React-Komponente
 */
export default function CartPage() {
  // ============================================================================
  // Hooks / Hooks
  // ============================================================================

  /**
   * Get cart state and items from CartContext
   * Hole Warenkorb-Zustand und Artikel aus CartContext
   */
  const { items } = useCart();

  /**
   * Get theme state for dark mode styling
   * Hole Theme-Zustand für Dark-Mode-Styling
   */
  const { darkMode } = useTheme();

  /**
   * Get navigation function from React Router
   * Hole Navigationsfunktion von React Router
   * 
   * Used to navigate back to products page from empty cart state.
   * Wird verwendet, um von leerem Warenkorb zur Produktseite zurückzukehren.
   */
  const navigate = useNavigate();

  // ============================================================================
  // Computed Values / Berechnete Werte
  // ============================================================================

  /**
   * Check if cart is empty
   * Prüfe, ob Warenkorb leer ist
   */
  const isEmpty = items.length === 0;

  // ============================================================================
  // Event Handlers / Event-Handler
  // ============================================================================

  /**
   * Handle navigation to products page
   * Behandelt Navigation zur Produktseite
   * 
   * Called when user clicks "Continue Shopping" button in empty cart state.
   * Wird aufgerufen, wenn Benutzer auf "Weiter einkaufen"-Button im leeren Warenkorb klickt.
   */
  const handleContinueShopping = () => {
    navigate('/products');
  };

  // ============================================================================
  // Dynamic Styling / Dynamisches Styling
  // ============================================================================

  /**
   * Dynamic classes for page background
   * Dynamische Klassen für Seitenhintergrund
   */
  const pageBgClasses = darkMode ? 'bg-dark' : 'bg-gray-100';

  /**
   * Dynamic classes for text elements
   * Dynamische Klassen für Textelemente
   */
  const textPrimaryClasses = darkMode ? 'text-light' : 'text-gray-900';
  const textSecondaryClasses = darkMode ? 'text-gray-400' : 'text-gray-600';

  /**
   * Dynamic classes for empty state icon
   * Dynamische Klassen für Leerzustands-Symbol
   */
  const iconClasses = darkMode ? 'text-gray-600' : 'text-gray-300';

  // ============================================================================
  // Render: Empty State / Rendern: Leerzustand
  // ============================================================================

  /**
   * Empty state when cart has no items
   * Leerzustand wenn Warenkorb keine Artikel hat
   * 
   * Shows a centered, friendly message with an empty cart icon and a CTA
   * button to navigate back to the products page.
   * 
   * Zeigt eine zentrierte, freundliche Nachricht mit einem leeren Warenkorb-Symbol
   * und einem CTA-Button zur Navigation zurück zur Produktseite.
   */
  if (isEmpty) {
    return (
      <div className={`${pageBgClasses} min-h-screen pt-20 pb-12 px-4 transition-colors duration-300`}>
        <div className="container mx-auto max-w-4xl">
          {/* 
            Empty State Container
            Leerzustands-Container
            
            Centered content with icon, message, and CTA button.
            Zentrierter Inhalt mit Symbol, Nachricht und CTA-Button.
          */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* 
              Empty Cart Icon (SVG)
              Leerer Warenkorb-Symbol (SVG)
              
              Large, friendly shopping cart icon to represent empty state.
              Großes, freundliches Warenkorb-Symbol zur Darstellung des Leerzustands.
            */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${iconClasses} w-32 h-32 mb-8`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {/* 
              Empty State Heading
              Leerzustands-Überschrift
              
              Main message informing user that cart is empty.
              Hauptnachricht, die den Benutzer informiert, dass der Warenkorb leer ist.
            */}
            <h1 className={`${textPrimaryClasses} text-3xl md:text-4xl font-bold mb-3`}>
              Your cart is empty
            </h1>
            <p className={`${textSecondaryClasses} text-lg mb-2`}>
              Ihr Warenkorb ist leer
            </p>

            {/* 
              Empty State Description
              Leerzustands-Beschreibung
              
              Friendly message encouraging user to browse products.
              Freundliche Nachricht, die den Benutzer ermutigt, Produkte zu durchsuchen.
            */}
            <p className={`${textSecondaryClasses} text-base mb-8 max-w-md`}>
              Looks like you haven't added anything to your cart yet. Start shopping to find great products!
            </p>
            <p className={`${textSecondaryClasses} text-sm mb-10 max-w-md opacity-75`}>
              Es sieht so aus, als hätten Sie noch nichts in Ihren Warenkorb gelegt. Beginnen Sie mit dem Einkaufen, um tolle Produkte zu finden!
            </p>

            {/* 
              Continue Shopping Button (CTA)
              Weiter einkaufen-Button (CTA)
              
              Primary call-to-action button to navigate to products page.
              Primärer Call-to-Action-Button zur Navigation zur Produktseite.
            */}
            <button
              type="button"
              onClick={handleContinueShopping}
              className="
                bg-primary text-white
                px-8 py-3
                rounded-lg
                font-semibold text-lg
                shadow-lg
                transition-all duration-200
                hover:bg-primary-dark hover:shadow-xl
                active:scale-95
                focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50
              "
              aria-label="Continue shopping and browse products"
            >
              Continue Shopping
              <span className="block text-sm font-normal mt-1">
                Weiter einkaufen
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render: Cart with Items / Rendern: Warenkorb mit Artikeln
  // ============================================================================

  /**
   * Main cart page layout with items and summary
   * Haupt-Warenkorb-Seiten-Layout mit Artikeln und Zusammenfassung
   * 
   * Two-column grid layout on large screens, stacked on small screens.
   * Zwei-Spalten-Grid-Layout auf großen Bildschirmen, gestapelt auf kleinen Bildschirmen.
   */
  return (
    <div className={`${pageBgClasses} min-h-screen pt-20 pb-12 px-4 transition-colors duration-300`}>
      <div className="container mx-auto max-w-7xl">
        {/* 
          Page Heading
          Seitenüberschrift
          
          Main heading for the shopping cart page.
          Hauptüberschrift für die Warenkorb-Seite.
        */}
        <h1 className={`${textPrimaryClasses} text-3xl md:text-4xl font-bold mb-8`}>
          Shopping Cart
          <span className={`${textSecondaryClasses} block text-lg font-normal mt-2`}>
            Warenkorb
          </span>
        </h1>

        {/* 
          Two-Column Grid Layout
          Zwei-Spalten-Grid-Layout
          
          Grid layout with:
          - Left column: Takes remaining space (1fr) for cart items
            Linke Spalte: Nimmt verbleibenden Platz (1fr) für Warenkorb-Artikel
          - Right column: Fixed 320px width for summary panel
            Rechte Spalte: Feste 320px Breite für Zusammenfassungs-Panel
          - Gap between columns for visual separation
            Abstand zwischen Spalten für visuelle Trennung
          - Stack vertically on small screens (default flex-col)
            Stapelt vertikal auf kleinen Bildschirmen (Standard flex-col)
          - Switch to grid on large screens (lg:grid)
            Wechselt zu Grid auf großen Bildschirmen (lg:grid)
          
          The `items-start` ensures the sticky panel aligns to the top and
          doesn't stretch to match the height of the items column, preventing
          overlap with the footer on short pages.
          
          Das `items-start` stellt sicher, dass das Sticky-Panel oben ausgerichtet
          ist und sich nicht streckt, um die Höhe der Artikelspalte anzupassen,
          wodurch eine Überlappung mit der Fußzeile auf kurzen Seiten verhindert wird.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* 
            Left Column: Cart Items List
            Linke Spalte: Warenkorb-Artikel-Liste
            
            Stacked list of CartItemRow components, one for each item in cart.
            Each row is a horizontal media object with product details.
            
            Gestapelte Liste von CartItemRow-Komponenten, eine für jeden Artikel im Warenkorb.
            Jede Zeile ist ein horizontales Medienobjekt mit Produktdetails.
          */}
          <div className="space-y-4" role="list" aria-label="Shopping cart items">
            {items.map((item) => (
              <div key={item.product.productId} role="listitem">
                <CartItemRow item={item} />
              </div>
            ))}
          </div>

          {/* 
            Right Column: Order Summary Panel
            Rechte Spalte: Bestellübersichts-Panel
            
            Sticky summary panel that stays visible while scrolling on large screens.
            Fixed width of 320px on large screens, full width on smaller screens.
            
            Sticky-Zusammenfassungs-Panel, das beim Scrollen auf großen Bildschirmen sichtbar bleibt.
            Feste Breite von 320px auf großen Bildschirmen, volle Breite auf kleineren Bildschirmen.
            
            The CartSummaryPanel component handles its own sticky positioning
            (lg:sticky lg:top-20) and will not overlap the footer due to the
            items-start alignment on the parent grid.
            
            Die CartSummaryPanel-Komponente behandelt ihre eigene Sticky-Positionierung
            (lg:sticky lg:top-20) und wird aufgrund der items-start-Ausrichtung
            auf dem übergeordneten Grid nicht mit der Fußzeile überlappen.
          */}
          <CartSummaryPanel />
        </div>
      </div>
    </div>
  );
}
