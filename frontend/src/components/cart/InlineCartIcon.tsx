import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';

// ============================================================================
// Type Definitions / Typdefinitionen
// ============================================================================

/**
 * Props for the InlineCartIcon component
 * Props für die InlineCartIcon-Komponente
 */
interface InlineCartIconProps {
  /** Optional CSS class for additional styling / Optionale CSS-Klasse für zusätzliches Styling */
  className?: string;
}

// ============================================================================
// Component / Komponente
// ============================================================================

/**
 * InlineCartIcon - A compact shopping cart icon with item count badge
 * InlineCartIcon - Ein kompaktes Warenkorb-Symbol mit Artikelanzahl-Badge
 * 
 * This component displays a shopping cart icon with a circular badge showing
 * the number of items in the cart. The badge animates (scales) only when the
 * count changes, not on every render. The component supports dark mode theming
 * and is fully accessible with ARIA labels.
 * 
 * Diese Komponente zeigt ein Warenkorb-Symbol mit einem kreisförmigen Badge,
 * das die Anzahl der Artikel im Warenkorb anzeigt. Das Badge wird nur animiert
 * (skaliert), wenn sich die Anzahl ändert, nicht bei jedem Rendering. Die
 * Komponente unterstützt Dark-Mode-Theming und ist mit ARIA-Labels vollständig
 * barrierefrei.
 * 
 * Features / Funktionen:
 * - Shopping cart outline icon / Warenkorb-Umriss-Symbol
 * - Circular count badge / Kreisförmiges Zähler-Badge
 * - Scale animation on count change / Skalierungsanimation bei Änderung der Anzahl
 * - Dark mode support / Dark-Mode-Unterstützung
 * - Accessible with ARIA labels / Barrierefrei mit ARIA-Labels
 * - Navigation to cart page / Navigation zur Warenkorb-Seite
 * 
 * @param props - Component props / Komponenten-Props
 * @returns React component / React-Komponente
 */
export default function InlineCartIcon({ className = '' }: InlineCartIconProps) {
  // ============================================================================
  // Hooks / Hooks
  // ============================================================================

  /**
   * Get cart state (itemCount) from CartContext
   * Hole Warenkorb-Zustand (itemCount) aus CartContext
   */
  const { itemCount } = useCart();

  /**
   * Get theme state (darkMode) from ThemeContext
   * Hole Theme-Zustand (darkMode) aus ThemeContext
   */
  const { darkMode } = useTheme();

  /**
   * Track previous item count to detect changes
   * Verfolge vorherige Artikelanzahl, um Änderungen zu erkennen
   */
  const prevCountRef = useRef<number>(itemCount);

  /**
   * State to control animation trigger
   * Zustand zur Steuerung des Animations-Triggers
   */
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // ============================================================================
  // Effects / Effekte
  // ============================================================================

  /**
   * Effect to trigger animation only when itemCount changes
   * Effekt zum Auslösen der Animation nur bei Änderung von itemCount
   * 
   * This effect compares the current itemCount with the previous value.
   * If they differ, it triggers the scale animation by setting shouldAnimate
   * to true, then resets it after the animation completes.
   * 
   * Dieser Effekt vergleicht die aktuelle itemCount mit dem vorherigen Wert.
   * Wenn sie sich unterscheiden, löst er die Skalierungsanimation aus, indem
   * shouldAnimate auf true gesetzt wird, und setzt es dann nach Abschluss der
   * Animation zurück.
   */
  useEffect(() => {
    // Check if count has changed / Prüfe, ob sich die Anzahl geändert hat
    if (prevCountRef.current !== itemCount) {
      // Trigger animation / Löse Animation aus
      setShouldAnimate(true);

      // Reset animation state after animation duration (300ms)
      // Setze Animations-Zustand nach Animations-Dauer zurück (300ms)
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 300);

      // Update previous count reference / Aktualisiere vorherige Anzahl-Referenz
      prevCountRef.current = itemCount;

      // Cleanup timer on unmount or when effect re-runs
      // Bereinige Timer beim Unmount oder wenn Effekt erneut ausgeführt wird
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  // ============================================================================
  // Render / Rendern
  // ============================================================================

  /**
   * Dynamic color classes based on theme
   * Dynamische Farbklassen basierend auf dem Theme
   */
  const iconColor = darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary';

  return (
    <Link
      to="/cart"
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-colors ${iconColor} ${className}`}
      aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    >
      {/* 
        Shopping Cart SVG Icon (Outline Style)
        Warenkorb-SVG-Symbol (Umriss-Stil)
        
        This icon uses a 24x24 viewBox and represents a shopping cart
        in outline form for a clean, modern appearance.
        
        Dieses Symbol verwendet eine 24x24-viewBox und stellt einen
        Warenkorb in Umrissform für ein sauberes, modernes Aussehen dar.
      */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        {/* Cart body path / Warenkorb-Körper-Pfad */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* 
        Count Badge (Circular Token)
        Zähler-Badge (Kreisförmiger Token)
        
        This badge displays the number of items in the cart. It's positioned
        in the top-right corner of the icon and uses the accent color from
        tailwind config. The badge only appears when itemCount > 0.
        
        Dieses Badge zeigt die Anzahl der Artikel im Warenkorb an. Es ist
        in der oberen rechten Ecke des Symbols positioniert und verwendet
        die Akzentfarbe aus der Tailwind-Konfiguration. Das Badge erscheint
        nur, wenn itemCount > 0 ist.
      */}
      {itemCount > 0 && (
        <span
          className={`
            absolute -top-1 -right-1
            flex items-center justify-center
            min-w-[20px] h-5 px-1.5
            bg-accent
            text-white text-xs font-semibold
            rounded-full
            shadow-md
            transition-transform duration-300 ease-out
            ${shouldAnimate ? 'scale-125' : 'scale-100'}
          `}
          aria-label={`${itemCount} items in cart`}
        >
          {/* 
            Display count, with 99+ for large numbers
            Zeige Anzahl an, mit 99+ für große Zahlen
            
            For better visual appearance, we cap the displayed count at 99+
            when there are more than 99 items.
            
            Für ein besseres visuelles Erscheinungsbild begrenzen wir die
            angezeigte Anzahl auf 99+, wenn mehr als 99 Artikel vorhanden sind.
          */}
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
