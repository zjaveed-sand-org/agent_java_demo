import { useTheme } from '../../context/ThemeContext';
import { FREE_SHIPPING_THRESHOLD_EXPORT } from '../../context/CartContext';

interface CartSummaryCardProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  onCheckout: () => void;
}

export default function CartSummaryCard({
  subtotal,
  shippingCost,
  total,
  onCheckout,
}: CartSummaryCardProps) {
  const { darkMode } = useTheme();
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD_EXPORT - subtotal;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-24`}
    >
      <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
        Order Summary
      </h2>

      {remainingForFreeShipping > 0 ? (
        <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-start gap-2">
            <svg
              className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Almost there!
              </p>
              <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Add ${remainingForFreeShipping.toFixed(2)} more to get free shipping
              </p>
            </div>
          </div>
          <div className={`mt-2 h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} overflow-hidden`}>
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD_EXPORT) * 100, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              You qualify for free shipping!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>Shipping:</span>
          <span className="font-semibold">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex justify-between font-bold text-xl ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            <span>Total:</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 shadow-md hover:shadow-lg"
      >
        Proceed to Checkout
      </button>

      <p className="mt-4 text-xs text-center text-gray-500">
        Taxes calculated at checkout
      </p>
    </div>
  );
}
