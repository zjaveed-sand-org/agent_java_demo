import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getShipping, getTotal } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-6 transition-colors duration-300`}>
              Your cart is empty
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart
        </h1>

        {/* Single Column Product List */}
        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const itemPrice = item.discount 
              ? item.price * (1 - item.discount)
              : item.price;
            const itemTotal = itemPrice * item.quantity;

            return (
              <div 
                key={item.productId} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm transition-colors duration-300`}
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className={`w-24 h-24 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden transition-colors duration-300`}>
                    <img 
                      src={`/${item.imgName}`} 
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-1 transition-colors duration-300`}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {item.discount ? (
                        <>
                          <span className="text-gray-500 line-through text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-primary font-semibold">
                            ${itemPrice.toFixed(2)}
                          </span>
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                            {Math.round(item.discount * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-primary font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors duration-300`}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`px-4 py-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className={`px-4 py-2 min-w-[3rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`px-4 py-2 ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors duration-300`}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className={`text-right ${darkMode ? 'text-light' : 'text-gray-800'} font-semibold text-lg transition-colors duration-300`}>
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm space-y-4 transition-colors duration-300`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
            Order Summary
          </h2>

          <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            <span>Subtotal</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>

          <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            <span>Shipping</span>
            <span>
              {getShipping() === 0 ? (
                <span className="text-primary font-semibold">FREE</span>
              ) : (
                `$${getShipping().toFixed(2)}`
              )}
            </span>
          </div>

          {getSubtotal() < 100 && getSubtotal() > 0 && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
              Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
            </p>
          )}

          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
            <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link 
              to="/products" 
              className={`flex-1 text-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-6 py-3 rounded-md text-sm font-medium transition-colors duration-300`}
            >
              Continue Shopping
            </Link>
            <button 
              className="flex-1 bg-primary hover:bg-accent text-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
