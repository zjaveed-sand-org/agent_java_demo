import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getSubtotal, getShipping, getTotal } = useCart();
  const { darkMode } = useTheme();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const freeShippingThreshold = 100;
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>Shopping Cart</h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center`}>
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className={`text-xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your cart is empty
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg transition-colors"
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
      <div className="max-w-4xl mx-auto py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Shopping Cart
        </h1>

        {/* Free Shipping Banner */}
        {amountUntilFreeShipping > 0 && (
          <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <p className="flex items-center">
              <span className="mr-2">💙</span>
              Add ${amountUntilFreeShipping.toFixed(2)} more to get FREE SHIPPING!
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-6 mb-8">
          {items.map(item => {
            const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
            return (
              <div
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className={`w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${itemPrice.toFixed(2)}
                        </p>
                        {item.discount && (
                          <p className="text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Subtotal ({getTotalItems()} items):</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Shipping:</span>
              <span className="font-medium">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 mt-3`}>
              <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-4">
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
