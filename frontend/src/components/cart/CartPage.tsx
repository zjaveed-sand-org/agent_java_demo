import { useCart } from '../../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../../constants/cart';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummaryCard from './CartSummaryCard';

export default function CartPage() {
  const { items, subtotal, lastRemovedItem, restoreLastRemoved } = useCart();
  const { darkMode } = useTheme();

  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-700' : 'text-gray-400'} mb-4`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Start shopping to add items to your cart
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
            Shopping Cart
          </h1>

          {/* Free Shipping Progress Bar */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow-lg transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                {freeShippingProgress >= 100 ? (
                  <span className="flex items-center">
                    <span className="text-primary mr-2">🎉</span>
                    You qualified for FREE shipping!
                  </span>
                ) : (
                  `${remainingForFreeShipping.toFixed(2)} away from FREE shipping`
                )}
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ${subtotal.toFixed(2)} of ${FREE_SHIPPING_THRESHOLD.toFixed(2)}
              </span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummaryCard />
          </div>
        </div>

        {/* Undo Recently Removed */}
        {lastRemovedItem && (
          <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 flex items-center space-x-4 animate-slideInRight z-50`}>
            <span className={`${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Removed "{lastRemovedItem.name}"
            </span>
            <button
              onClick={restoreLastRemoved}
              className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Restore
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
