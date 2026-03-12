import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, shipping, total, totalItems } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-300`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
              Add some products to get started
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                Shopping Cart
              </h1>
              <button
                onClick={clearCart}
                className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors duration-300`}
              >
                Clear Cart
              </button>
            </div>

            {/* Table Header - Hidden on mobile */}
            <div className={`hidden md:grid md:grid-cols-12 gap-4 p-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'} rounded-t-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
              <div className="col-span-5 font-semibold text-sm uppercase tracking-wide">Product Details</div>
              <div className="col-span-2 font-semibold text-sm uppercase tracking-wide text-center">Unit Price</div>
              <div className="col-span-2 font-semibold text-sm uppercase tracking-wide text-center">Quantity</div>
              <div className="col-span-2 font-semibold text-sm uppercase tracking-wide text-center">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 md:space-y-0">
              {items.map((item, index) => {
                const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item.productId}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} ${index === 0 ? 'md:rounded-t-none' : ''} ${index === items.length - 1 ? 'rounded-b-lg' : ''} p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Details */}
                      <div className="md:col-span-5 flex gap-4">
                        <div className={`w-24 h-24 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden transition-colors duration-300`}>
                          <img
                            src={`/${item.imgName}`}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                            {item.description}
                          </p>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2 space-y-1`}>
                            <div>SKU: {item.sku}</div>
                            <div>Unit: {item.unit}</div>
                            <div>Supplier ID: {item.supplierId}</div>
                          </div>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="md:col-span-2 flex md:justify-center items-center">
                        <span className="md:hidden font-semibold mr-2">Price:</span>
                        <div className="flex flex-col items-start md:items-center">
                          {item.discount ? (
                            <>
                              <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary font-semibold">
                                ${itemPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-primary">
                                {Math.round(item.discount * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                              ${itemPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="md:col-span-2 flex md:justify-center items-center">
                        <span className="md:hidden font-semibold mr-2">Quantity:</span>
                        <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 transition-colors duration-300`}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'} rounded transition-colors duration-300`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className={`min-w-[2rem] text-center font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'} rounded transition-colors duration-300`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="md:col-span-2 flex md:justify-center items-center">
                        <span className="md:hidden font-semibold mr-2">Total:</span>
                        <span className={`text-lg font-bold text-primary`}>
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="md:col-span-1 flex md:justify-center items-center">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors duration-300`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                    Items ({totalItems})
                  </span>
                  <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                    Shipping
                  </span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-primary' : darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {subtotal < 100 && (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} bg-blue-50 dark:bg-blue-900/20 p-3 rounded transition-colors duration-300`}>
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors duration-300 mt-6">
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors duration-300 mt-4`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
