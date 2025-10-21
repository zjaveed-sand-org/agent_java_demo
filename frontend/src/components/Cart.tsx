import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalItems, getSubtotal, getShipping, getTotal } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-12">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-12 text-center transition-colors duration-300`}>
            <svg 
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
              Start adding some products to your cart!
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
          Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - List Style with Detailed Information */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}>
              {/* Table Header */}
              <div className={`hidden md:grid md:grid-cols-12 gap-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} px-6 py-4 font-semibold ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors duration-300`}>
                <div className="col-span-5">Product Details</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map(item => {
                  const itemPrice = item.discount 
                    ? item.price * (1 - item.discount)
                    : item.price;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={item.productId} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Product Details */}
                        <div className="col-span-1 md:col-span-5">
                          <div className="flex gap-4">
                            <div className={`w-24 h-24 flex-shrink-0 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} overflow-hidden transition-colors duration-300`}>
                              <img 
                                src={`/${item.imgName}`} 
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-1 transition-colors duration-300`}>
                                {item.name}
                              </h3>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 transition-colors duration-300`}>
                                {item.description}
                              </p>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} space-y-1 transition-colors duration-300`}>
                                <div className="flex gap-4">
                                  <span className="font-medium">SKU:</span>
                                  <span>{item.sku}</span>
                                </div>
                                <div className="flex gap-4">
                                  <span className="font-medium">Unit:</span>
                                  <span>{item.unit}</span>
                                </div>
                                <div className="flex gap-4">
                                  <span className="font-medium">Supplier ID:</span>
                                  <span>{item.supplierId}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-1 md:col-span-2 text-left md:text-center">
                          <div className="md:hidden">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Price:</span>
                          </div>
                          {item.discount ? (
                            <div>
                              <span className="text-gray-500 line-through text-sm mr-2">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-primary font-semibold">
                                ${itemPrice.toFixed(2)}
                              </span>
                              <div className="text-xs text-primary mt-1">
                                {Math.round(item.discount * 100)}% off
                              </div>
                            </div>
                          ) : (
                            <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                              ${itemPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-span-1 md:col-span-3">
                          <div className="md:hidden mb-2">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity:</span>
                          </div>
                          <div className="flex items-center gap-2 md:justify-center">
                            <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg transition-colors duration-300`}>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                                className={`w-16 text-center ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-colors duration-300`}
                                aria-label={`Quantity of ${item.name}`}
                              />
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors duration-300`}
                              aria-label={`Remove ${item.name} from cart`}
                              title="Remove from cart"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="col-span-1 md:col-span-2 text-left md:text-right">
                          <div className="md:hidden">
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`}>Subtotal:</span>
                          </div>
                          <span className={`font-bold text-lg ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-4">
              <Link 
                to="/products"
                className={`inline-flex items-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors duration-300`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors duration-300`}>
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                    Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                    Shipping
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {getShipping() === 0 ? (
                      <span className="text-primary">FREE</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>

                {getShipping() > 0 && (
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic transition-colors duration-300`}>
                    Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
                  </div>
                )}

                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors duration-300 mt-6">
                  Proceed to Checkout
                </button>

                <div className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-4 transition-colors duration-300`}>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
