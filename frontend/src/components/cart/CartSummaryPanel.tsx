import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

// ============================================================================
// Type Definitions / Typdefinitionen
// ============================================================================

/**
 * Props for the CartSummaryPanel component
 * Props für die CartSummaryPanel-Komponente
 */
interface CartSummaryPanelProps {
  /** Optional CSS class for additional styling / Optionale CSS-Klasse für zusätzliches Styling */
  className?: string;
}

// ============================================================================
// Constants / Konstanten
// ============================================================================

/**
 * Business rules for shipping and free shipping thresholds
 * Geschäftsregeln für Versand und Kostenlos-Versand-Schwellenwerte
 */
const FREE_SHIPPING_THRESHOLD = 50; // Free shipping when subtotal >= $50 / Kostenloser Versand bei Zwischensumme >= $50
const FREE_SHIPPING_PROGRESS_GOAL = 100; // Show progress toward $100 for "free shipping achievement" / Zeige Fortschritt zu $100 für "Kostenlos-Versand-Errungenschaft"

// ============================================================================
// Helper Functions / Hilfsfunktionen
// ============================================================================

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
 * CartSummaryPanel - Displays order summary with pricing and checkout CTA
 * CartSummaryPanel - Zeigt Bestellübersicht mit Preisen und Checkout-CTA
 * 
 * This component displays a sticky order summary panel that includes:
 * - Order summary heading / Bestellüberschrift
 * - Subtotal line / Zwischensummenzeile
 * - Shipping line (FREE or $5.99) / Versandzeile (KOSTENLOS oder $5.99)
 * - Total line (bold, prominent) / Gesamtzeile (fett, hervorgehoben)
 * - Free shipping progress bar / Kostenloser Versand Fortschrittsbalken
 * - Checkout button (primary CTA) / Checkout-Button (primärer CTA)
 * 
 * Diese Komponente zeigt ein klebendes Bestellübersicht-Panel, das Folgendes enthält:
 * - Bestellüberschrift
 * - Zwischensummenzeile
 * - Versandzeile (KOSTENLOS oder $5.99)
 * - Gesamtzeile (fett, hervorgehoben)
 * - Fortschrittsbalken für kostenlosen Versand
 * - Checkout-Button (primärer CTA)
 * 
 * Features / Funktionen:
 * - Sticky positioning on large screens (lg+) at top-20 (80px from top)
 *   Sticky-Positionierung auf großen Bildschirmen (lg+) bei top-20 (80px von oben)
 * - Fixed width of 320px on large screens, full width on smaller screens
 *   Feste Breite von 320px auf großen Bildschirmen, volle Breite auf kleineren Bildschirmen
 * - Progress bar shows progress toward $100 free shipping goal
 *   Fortschrittsbalken zeigt Fortschritt zum $100 Kostenlos-Versand-Ziel
 * - Shows "Add $X.XX more for free shipping!" when under $50
 *   Zeigt "Add $X.XX more for free shipping!" wenn unter $50
 * - Shows "You've qualified for free shipping!" when >= $50
 *   Zeigt "You've qualified for free shipping!" wenn >= $50
 * - Dark mode support / Dark-Mode-Unterstützung
 * - Clean card-like appearance with shadows / Sauberes kartenartiges Aussehen mit Schatten
 * 
 * Responsive behavior / Responsives Verhalten:
 * - lg+ screens: 320px fixed width, sticky at top-20, positioned on right side
 *   lg+ Bildschirme: 320px feste Breite, sticky bei top-20, auf der rechten Seite positioniert
 * - smaller screens: full width, not sticky, flows with content
 *   kleinere Bildschirme: volle Breite, nicht sticky, fließt mit dem Inhalt
 * 
 * @param props - Component props / Komponenten-Props
 * @returns React component / React-Komponente
 */
export default function CartSummaryPanel({ className = '' }: CartSummaryPanelProps) {
  // ============================================================================
  // Hooks / Hooks
  // ============================================================================

  /**
   * Get cart state from CartContext
   * Hole Warenkorb-Zustand aus CartContext
   */
  const { subtotal, shipping, total } = useCart();

  /**
   * Get theme state for dark mode styling
   * Hole Theme-Zustand für Dark-Mode-Styling
   */
  const { darkMode } = useTheme();

  // ============================================================================
  // Computed Values / Berechnete Werte
  // ============================================================================

  /**
   * Calculate if customer qualifies for free shipping
   * Berechne, ob Kunde sich für kostenlosen Versand qualifiziert
   */
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  /**
   * Calculate amount needed to reach free shipping threshold
   * Berechne Betrag, der benötigt wird, um Kostenlos-Versand-Schwellenwert zu erreichen
   */
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  /**
   * Calculate progress percentage toward free shipping goal ($100)
   * Berechne Fortschrittsprozentsatz zum Kostenlos-Versand-Ziel ($100)
   * 
   * Progress is capped at 100% / Fortschritt ist auf 100% begrenzt
   */
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_PROGRESS_GOAL) * 100);

  // ============================================================================
  // Event Handlers / Event-Handler
  // ============================================================================

  /**
   * Checkout disabled state for demo purposes
   * Checkout deaktivierter Zustand für Demo-Zwecke
   * 
   * Set to true to disable checkout button until proper implementation.
   * Auf true gesetzt, um Checkout-Button bis zur ordnungsgemäßen Implementierung zu deaktivieren.
   */
  const isCheckoutDisabled = true;

  /**
   * Handle checkout button click
   * Behandelt Checkout-Button-Klick
   * 
   * Currently shows alert as placeholder. In production, this would
   * navigate to checkout page or open checkout modal.
   * 
   * Zeigt derzeit Alert als Platzhalter. In der Produktion würde dies
   * zur Checkout-Seite navigieren oder Checkout-Modal öffnen.
   */
  const handleCheckout = () => {
    alert('Checkout functionality coming soon! / Checkout-Funktionalität kommt bald!');
  };

  // ============================================================================
  // Dynamic Styling / Dynamisches Styling
  // ============================================================================

  /**
   * Dynamic classes based on theme for card container
   * Dynamische Klassen basierend auf Theme für Karten-Container
   */
  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700 text-light'
    : 'bg-white border-gray-200 text-gray-900';

  /**
   * Dynamic classes for text elements
   * Dynamische Klassen für Textelemente
   */
  const textPrimaryClasses = darkMode ? 'text-light' : 'text-gray-900';
  const textSecondaryClasses = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textSuccessClasses = darkMode ? 'text-green-400' : 'text-green-600';

  /**
   * Dynamic classes for divider lines
   * Dynamische Klassen für Trennlinien
   */
  const dividerClasses = darkMode ? 'border-gray-700' : 'border-gray-200';

  /**
   * Dynamic classes for progress bar background
   * Dynamische Klassen für Fortschrittsbalken-Hintergrund
   */
  const progressBgClasses = darkMode ? 'bg-gray-700' : 'bg-gray-200';

  // ============================================================================
  // Render / Rendern
  // ============================================================================

  return (
    <div
      className={`
        ${cardClasses}
        ${className}
        border rounded-lg shadow-lg
        p-6
        w-full lg:w-80
        lg:sticky lg:top-20
        transition-colors duration-300
      `}
      role="complementary"
      aria-label="Order summary"
    >
      {/* 
        Order Summary Heading
        Bestellübersicht-Überschrift
        
        Main heading for the summary panel.
        Hauptüberschrift für das Übersichts-Panel.
      */}
      <h2 className={`${textPrimaryClasses} text-xl font-bold mb-4`}>
        Order Summary
        <span className="block text-sm font-normal mt-1 opacity-75">
          Bestellübersicht
        </span>
      </h2>

      {/* 
        Pricing Details Section
        Preisdetails-Bereich
        
        Contains subtotal, shipping, and total lines.
        Enthält Zwischensumme, Versand und Gesamtzeilen.
      */}
      <div className="space-y-3 mb-4">
        {/* 
          Subtotal Line
          Zwischensummenzeile
          
          Shows the sum of all cart items before shipping.
          Zeigt die Summe aller Warenkorb-Artikel vor Versand.
        */}
        <div className="flex justify-between items-center">
          <span className={textSecondaryClasses}>
            Subtotal
            <span className="text-xs block opacity-75">Zwischensumme</span>
          </span>
          <span className={`${textPrimaryClasses} font-medium`}>
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* 
          Shipping Line
          Versandzeile
          
          Shows shipping cost or "FREE" if qualified.
          Zeigt Versandkosten oder "KOSTENLOS" wenn qualifiziert.
        */}
        <div className="flex justify-between items-center">
          <span className={textSecondaryClasses}>
            Shipping
            <span className="text-xs block opacity-75">Versand</span>
          </span>
          <span
            className={`
              font-medium
              ${qualifiesForFreeShipping ? textSuccessClasses : textPrimaryClasses}
            `}
          >
            {qualifiesForFreeShipping ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        {/* 
          Divider Line
          Trennlinie
          
          Visual separator between line items and total.
          Visuelle Trennung zwischen Zeileneinträgen und Gesamtsumme.
        */}
        <div className={`border-t ${dividerClasses} pt-3`} />

        {/* 
          Total Line
          Gesamtzeile
          
          Shows final total (subtotal + shipping) in bold.
          Zeigt Endsumme (Zwischensumme + Versand) fett an.
        */}
        <div className="flex justify-between items-center">
          <span className={`${textPrimaryClasses} font-bold text-lg`}>
            Total
            <span className="text-xs block font-normal opacity-75">Gesamt</span>
          </span>
          <span className={`${textPrimaryClasses} font-bold text-xl`}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* 
        Free Shipping Progress Section
        Kostenloser Versand Fortschritts-Bereich
        
        Shows progress bar and message about free shipping status.
        Zeigt Fortschrittsbalken und Nachricht über Kostenlos-Versand-Status.
      */}
      <div className="mb-6">
        {/* 
          Progress Bar Container
          Fortschrittsbalken-Container
          
          Rounded bar with background and filled portion showing progress.
          Abgerundeter Balken mit Hintergrund und gefülltem Teil, der Fortschritt zeigt.
        */}
        <div className={`${progressBgClasses} rounded-full h-2 mb-2 overflow-hidden`}>
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Free shipping progress: ${progressPercentage.toFixed(0)}%`}
          />
        </div>

        {/* 
          Progress Message
          Fortschrittsnachricht
          
          Shows encouragement to add more or congratulations for qualifying.
          Zeigt Ermutigung, mehr hinzuzufügen oder Glückwünsche zur Qualifizierung.
        */}
        <p className={`${textSecondaryClasses} text-xs text-center`}>
          {qualifiesForFreeShipping ? (
            <>
              <span className={textSuccessClasses + ' font-semibold'}>
                ✓ You've qualified for free shipping!
              </span>
              <span className="block mt-1 opacity-75">
                Sie haben sich für kostenlosen Versand qualifiziert!
              </span>
            </>
          ) : (
            <>
              <span>
                Add <span className="font-semibold">{formatPrice(amountToFreeShipping)}</span> more for free shipping!
              </span>
              <span className="block mt-1 opacity-75">
                Fügen Sie {formatPrice(amountToFreeShipping)} mehr hinzu für kostenlosen Versand!
              </span>
            </>
          )}
        </p>
      </div>

      {/* 
        Checkout Button
        Checkout-Button
        
        Primary call-to-action button to proceed to checkout.
        Currently disabled and shows alert placeholder.
        
        Primärer Call-to-Action-Button zur Weiterleitung zum Checkout.
        Derzeit deaktiviert und zeigt Alert-Platzhalter.
      */}
      <button
        onClick={handleCheckout}
        disabled={isCheckoutDisabled}
        className={`
          w-full
          bg-primary text-white
          py-3 px-6
          rounded-lg
          font-semibold text-lg
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50
          ${
            isCheckoutDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary-dark hover:shadow-lg active:scale-95'
          }
        `}
        aria-label="Proceed to checkout"
      >
        Checkout
        <span className="block text-sm font-normal mt-1">
          Zur Kasse
        </span>
      </button>

      {/* 
        Disabled Notice
        Deaktivierungs-Hinweis
        
        Small notice explaining button is disabled for demo.
        Kleiner Hinweis, der erklärt, dass Button für Demo deaktiviert ist.
      */}
      <p className={`${textSecondaryClasses} text-xs text-center mt-3 opacity-60`}>
        Button currently disabled for demo
        <span className="block">Button derzeit für Demo deaktiviert</span>
      </p>
    </div>
  );
}
