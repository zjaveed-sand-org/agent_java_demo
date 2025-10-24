import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface CartPreviewProps {
  isVisible: boolean;
}

export default function CartPreview({ isVisible }: CartPreviewProps) {
  const { items, totalPrice } = useCart();
  const { darkMode } = useTheme();

  if (!isVisible) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-96 rounded-lg shadow-2xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } transition-all duration-300 transform origin-top-right z-50 animate-in slide-in-from-top-2`}
    >
      <div className="p-4">
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? 'text-light' : 'text-gray-800'
          }`}
        >
          Shopping Cart
        </h3>

        {items.length === 0 ? (
          <div
            className={`text-center py-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
              {items.slice(0, 3).map(item => {
                const price = item.discount
                  ? item.price * (1 - item.discount)
                  : item.price;
                return (
                  <div
                    key={item.productId}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          darkMode ? 'text-light' : 'text-gray-800'
                        }`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {item.quantity} × ${price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        darkMode ? 'text-primary' : 'text-primary'
                      }`}
                    >
                      ${(price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
              {items.length > 3 && (
                <p
                  className={`text-xs text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  +{items.length - 3} more items
                </p>
              )}
            </div>

            <div
              className={`border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } pt-4 mb-4`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`font-semibold ${
                    darkMode ? 'text-light' : 'text-gray-800'
                  }`}
                >
                  Subtotal:
                </span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="block w-full bg-primary hover:bg-accent text-white text-center py-2 rounded-lg font-medium transition-colors"
            >
              View Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
