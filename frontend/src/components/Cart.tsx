import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, getShippingCost } = useCart();
  const { darkMode } = useTheme();

  const subtotal = getTotalPrice();
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <svg 
              className={`w-24 h-24 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add some products to get started
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>
          Shopping Cart
          <span className={`ml-2 text-xl font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map(item => {
                const itemPrice = item.discount 
                  ? item.price * (1 - item.discount)
                  : item.price;
                
                return (
                  <div 
                    key={item.productId}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} p-4`}>
                      <img 
                        src={`/${item.imgName}`} 
                        alt={item.name}
                        className="w-full h-48 object-contain"
                      />
                      {item.discount && (
                        <div className="absolute top-8 left-0 bg-primary text-white px-3 py-1 text-sm font-medium -rotate-90 transform -translate-x-5 shadow-md">
                          {Math.round(item.discount * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {item.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-baseline space-x-2">
                        {item.discount ? (
                          <>
                            <span className="text-gray-500 line-through text-sm">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-primary text-xl font-bold">
                              ${itemPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary text-xl font-bold">
                            ${itemPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-2">
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

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-red-500 hover:bg-gray-700' : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'} transition-colors`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className={`pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Item total:
                        </span>
                        <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 sticky top-24 space-y-4`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Order Summary
              </h2>

              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subtotal
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Shipping
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {shipping === 0 ? (
                      <span className="text-primary font-semibold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && subtotal < 100 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} pt-2`}>
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>

              <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors mt-4"
                onClick={() => alert('Checkout functionality coming soon!')}
              >
                Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} py-2 transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
