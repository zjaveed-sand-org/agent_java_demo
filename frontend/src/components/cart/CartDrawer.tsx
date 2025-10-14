import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { FREE_SHIPPING_THRESHOLD_EXPORT } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, shippingCost, total, totalItems } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstFocusableRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD_EXPORT - subtotal;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2
              id="cart-drawer-title"
              className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}
            >
              Shopping Cart ({totalItems})
            </h2>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className={`${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1`}
              aria-label="Close cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <svg
                className={`w-24 h-24 ${darkMode ? 'text-gray-700' : 'text-gray-300'} animate-bounce`}
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
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
                return (
                  <div
                    key={item.productId}
                    className={`flex gap-3 p-3 rounded-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    } transition-colors`}
                  >
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold">${itemPrice.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-7 h-7 flex items-center justify-center rounded ${
                            darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'
                          } hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-7 h-7 flex items-center justify-center rounded ${
                            darkMode ? 'bg-gray-700 text-light' : 'bg-gray-200 text-gray-800'
                          } hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className={`ml-auto text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-3`}>
            {remainingForFreeShipping > 0 && (
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} text-sm`}>
                <p className={darkMode ? 'text-gray-300' : 'text-blue-800'}>
                  Add ${remainingForFreeShipping.toFixed(2)} more for free shipping!
                </p>
              </div>
            )}
            <div className="space-y-2">
              <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className={`flex justify-between font-bold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleViewCart}
              className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
