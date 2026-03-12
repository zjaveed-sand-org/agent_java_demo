import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotal, getShipping, getGrandTotal } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-12 text-center transition-colors duration-300`}>
            <div className="flex justify-center mb-6">
              <svg 
                className={`w-24 h-24 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Your Cart is Empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 text-lg transition-colors duration-300`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart
        </h1>
        
        {/* Grid Layout: Items on left, Summary on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const itemPrice = item.discount 
                ? item.price * (1 - item.discount)
                : item.price;
              
              return (
                <div 
                  key={item.productId} 
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row p-6 gap-6">
                    {/* Product Image */}
                    <div className={`flex-shrink-0 w-full sm:w-32 h-32 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-xl overflow-hidden flex items-center justify-center transition-colors duration-300`}>
                      <img 
                        src={`/${item.imgName}`} 
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300`}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Price Display */}
                        <div className="mb-4">
                          {item.discount ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 line-through text-sm">${item.price.toFixed(2)}</span>
                              <span className="text-primary text-2xl font-bold">${itemPrice.toFixed(2)}</span>
                              <span className="bg-primary text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                {Math.round(item.discount * 100)}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-primary text-2xl font-bold">${itemPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls and Subtotal */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className={`flex items-center gap-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-2 transition-colors duration-300`}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-gray-600 text-light hover:bg-primary' : 'bg-white text-gray-700 hover:bg-primary hover:text-white'} rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300`}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </button>
                          <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-bold text-xl min-w-[3rem] text-center transition-colors duration-300`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-gray-600 text-light hover:bg-primary' : 'bg-white text-gray-700 hover:bg-primary hover:text-white'} rounded-lg font-bold shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300`}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className={`${darkMode ? 'text-light' : 'text-gray-800'} font-bold text-2xl transition-colors duration-300`}>
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg transition-colors duration-300`}>
                    Subtotal
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold text-lg transition-colors duration-300`}>
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg transition-colors duration-300`}>
                    Shipping
                  </span>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold text-lg transition-colors duration-300`}>
                    {getShipping() === 0 ? (
                      <span className="text-primary font-bold">FREE</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {getTotal() < 100 && (
                  <div className={`${darkMode ? 'bg-primary/10 border-primary/30' : 'bg-primary/10 border-primary/30'} border rounded-xl p-3 transition-colors duration-300`}>
                    <p className={`text-sm ${darkMode ? 'text-primary' : 'text-primary'} font-semibold`}>
                      Add ${(100 - getTotal()).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}
                
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-bold text-xl transition-colors duration-300`}>
                      Total
                    </span>
                    <span className="text-primary font-bold text-3xl">
                      ${getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} font-semibold transition-colors duration-300`}
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
