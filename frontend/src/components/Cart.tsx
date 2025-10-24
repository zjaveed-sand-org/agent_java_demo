import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const FREE_SHIPPING_THRESHOLD = 50;

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { darkMode } = useTheme();
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  
  const totalPrice = getTotalPrice();
  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const needsForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setAnimatingItems(prev => new Set(prev).add(productId));
    updateQuantity(productId, newQuantity);
    setTimeout(() => {
      setAnimatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 300);
  };

  const handleRemove = (productId: number) => {
    setAnimatingItems(prev => new Set(prev).add(productId));
    setTimeout(() => {
      removeFromCart(productId);
      setAnimatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 200);
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>
            Shopping Cart
          </h1>
          
          <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} rounded-2xl shadow-xl p-12 text-center transition-colors duration-300`}>
            <div className="flex justify-center mb-6">
              <svg 
                className={`w-24 h-24 ${darkMode ? 'text-gray-600' : 'text-gray-300'} transition-colors duration-300`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
              Start shopping to add items to your cart
            </p>
            <a 
              href="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} tracking-tight transition-colors duration-300`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} text-sm font-medium transition-colors duration-300`}
          >
            Clear Cart
          </button>
        </div>

        {/* Progress Bar for Free Shipping */}
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} tracking-wide transition-colors duration-300`}>
              {shippingProgress >= 100 ? '🎉 FREE SHIPPING UNLOCKED!' : 'Progress to Free Shipping'}
            </span>
            {shippingProgress < 100 && (
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                ${needsForFreeShipping.toFixed(2)} more
              </span>
            )}
          </div>
          
          <div className={`h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${shippingProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {shippingProgress >= 100 && (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium animate-bounce">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You've earned free shipping!
              </span>
            </div>
          )}
        </div>

        {/* Cart Items - Card Based */}
        <div className="space-y-4 mb-6">
          {items.map((item) => {
            const itemPrice = item.discount 
              ? item.price * (1 - item.discount) 
              : item.price;
            const isAnimating = animatingItems.has(item.productId);
            
            return (
              <div 
                key={item.productId}
                className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
                style={{ 
                  transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.3s ease-out'
                }}
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className={`relative flex-shrink-0 w-32 h-32 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} rounded-xl overflow-hidden transition-colors duration-300 group-hover:scale-105 transition-transform duration-300`}>
                      <img 
                        src={`/${item.imgName}`} 
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                      {item.discount && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                          {Math.round(item.discount * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-1 tracking-tight transition-colors duration-300`}>
                            {item.name}
                          </h3>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-2 transition-colors duration-300`}>
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors duration-300 p-2 rounded-lg hover:bg-red-50/10`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium transition-colors duration-300`}>
                            Quantity:
                          </span>
                          <div className={`flex items-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-xl p-1 shadow-inner transition-colors duration-300`}>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'} rounded-lg transition-all duration-200 font-bold`}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>
                            <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold min-w-[3rem] text-center text-lg transition-colors duration-300`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className={`w-10 h-10 flex items-center justify-center ${darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'} rounded-lg transition-all duration-200 font-bold`}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.discount ? (
                            <div>
                              <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm line-through transition-colors duration-300`}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-primary text-2xl font-bold">
                                ${(itemPrice * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-primary text-2xl font-bold">
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Recommendations */}
        <div className={`${darkMode ? 'bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm' : 'bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm'} rounded-2xl shadow-lg p-6 mb-6 border ${darkMode ? 'border-primary/30' : 'border-primary/20'} transition-colors duration-300`}>
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Complete Your Cat's Setup
            </h3>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm transition-colors duration-300`}>
            Based on your current selection, we recommend exploring our premium cat tech accessories to enhance your feline's lifestyle.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} rounded-2xl shadow-xl p-8 sticky top-24 transition-colors duration-300`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 tracking-tight transition-colors duration-300`}>
            Order Summary
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
              <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-semibold text-lg transition-colors duration-300`}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                Shipping
              </span>
              <span className={`font-semibold text-lg ${shippingProgress >= 100 ? 'text-primary' : darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                {shippingProgress >= 100 ? 'FREE' : '$5.99'}
              </span>
            </div>
            
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} tracking-tight transition-colors duration-300`}>
                  Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${(totalPrice + (shippingProgress >= 100 ? 0 : 5.99)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Proceed to Checkout
          </button>
          
          <div className="mt-4 text-center">
            <a 
              href="/products" 
              className={`${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} text-sm font-medium transition-colors duration-300 inline-flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-bounce {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
