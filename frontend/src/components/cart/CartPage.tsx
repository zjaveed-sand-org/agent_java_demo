import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartGridItem from './CartGridItem';
import CartSummaryCard from './CartSummaryCard';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shippingCost, total, clearCart } = useCart();
  const { darkMode } = useTheme();

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Shopping Cart
              </h1>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className={`text-sm ${
                    darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-1`}
                >
                  Clear All
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-lg p-12 text-center`}
              >
                <svg
                  className={`w-32 h-32 mx-auto mb-6 ${
                    darkMode ? 'text-gray-700' : 'text-gray-300'
                  } animate-bounce`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Your cart is empty
                </h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Looks like you haven't added anything to your cart yet
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(item => (
                    <CartGridItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to="/products"
                    className={`inline-flex items-center gap-2 ${
                      darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-3 py-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Summary Sidebar */}
          {items.length > 0 && (
            <div className="lg:w-96">
              <CartSummaryCard
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
