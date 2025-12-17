import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, change: number) => {
    const item = items.find((i: CartItem) => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + change);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-12 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4 transition-colors duration-300`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              Add some products to get started!
            </p>
            <a
              href="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} text-sm font-medium transition-colors`}
            aria-label="Clear cart"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => {
              const itemPrice = item.discount 
                ? item.price * (1 - item.discount) 
                : item.price;
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={item.productId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 transition-colors duration-300`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className={`w-full sm:w-32 h-32 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg flex items-center justify-center transition-colors duration-300`}>
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
                          <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1 transition-colors duration-300`}>
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
                        {/* Price */}
                        <div className="mb-3 sm:mb-0">
                          {item.discount ? (
                            <div>
                              <span className="text-gray-500 line-through text-sm mr-2">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary text-xl font-bold">
                                ${itemPrice.toFixed(2)}
                              </span>
                              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                each
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-primary text-xl font-bold">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                each
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                            <button
                              onClick={() => handleQuantityChange(item.productId, -1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <span aria-hidden="true">-</span>
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium transition-colors duration-300`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right min-w-[80px]">
                            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs transition-colors duration-300`}>
                              Total
                            </div>
                            <div className={`${darkMode ? 'text-light' : 'text-gray-800'} text-xl font-bold transition-colors duration-300`}>
                              ${itemTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 transition-colors duration-300`}>
                  <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-3"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>

              <a
                href="/products"
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} text-sm transition-colors`}
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
