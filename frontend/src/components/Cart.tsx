import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, total } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center py-16">
          <svg
            className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <h2 className={`mt-6 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Your cart is empty
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse our products and add items to your cart.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map(item => {
            const effectivePrice = item.discount
              ? item.price * (1 - item.discount)
              : item.price;

            return (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 flex items-center gap-4 transition-colors duration-300`}
              >
                <div className={`w-20 h-20 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
                  <img
                    src={`/${item.imgName}`}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.discount ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">${item.price.toFixed(2)}</span>
                        <span className="text-primary font-medium">${effectivePrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary font-medium">${effectivePrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={`text-right min-w-[5rem] ${darkMode ? 'text-light' : 'text-gray-800'} font-semibold`}>
                  ${(effectivePrice * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
          <div className="space-y-2">
            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-2`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled
            className="mt-6 w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Checkout coming soon"
          >
            Proceed to Checkout
          </button>
          <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Checkout functionality coming soon
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/products"
            className={`text-primary hover:text-accent font-medium transition-colors`}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
