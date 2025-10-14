import { useCart } from '../../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../../constants/cart';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartSummaryCard() {
  const { subtotal, shipping, tax, total, clearCart } = useCart();
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24 transition-colors duration-300`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 flex items-center`}>
        <span className="mr-2">📊</span>
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal:</span>
          <div className="flex items-center">
            <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              ${subtotal.toFixed(2)}
            </span>
            <span className="text-green-500 ml-2">✓</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping:</span>
          <div className="flex items-center">
            {shipping === 0 ? (
              <>
                <span className="text-primary font-semibold">FREE</span>
                <span className="ml-2">🎉</span>
              </>
            ) : (
              <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                ${shipping.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tax (estimated):</span>
          <div className="flex items-center">
            <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              ${tax.toFixed(2)}
            </span>
            <span className="ml-2">⏳</span>
          </div>
        </div>

        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 mt-3`}>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total:</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
              <span className="text-green-500 ml-2">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          onClick={() => alert('Checkout functionality coming soon!')}
        >
          <span className="mr-2">🚀</span>
          Proceed to Checkout
        </button>

        <button
          onClick={clearCart}
          className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} py-2 rounded-lg font-medium transition-colors`}
        >
          Clear Cart
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
          💳 Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            className={`w-full text-left px-3 py-2 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors text-sm`}
            onClick={() => alert('Save for later feature coming soon!')}
          >
            Save for Later
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors text-sm flex items-center`}
            onClick={() => alert('Wishlist feature coming soon!')}
          >
            <span className="mr-2">♡</span>
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Shipping Info */}
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
            💡 Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more to get free shipping!
          </p>
        </div>
      )}

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link
          to="/products"
          className={`text-sm ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} font-medium transition-colors`}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
