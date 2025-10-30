import { useCart } from '../context/CartSimpleContext';
import { useTheme } from '../context/ThemeContext';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dropdown */}
      <div 
        className={`absolute right-0 mt-2 w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto transition-colors duration-300`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
          <button 
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg 
              className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map(item => (
              <div key={item.productId} className="p-4">
                <div className="flex gap-3">
                  <img 
                    src={`/${item.imgName}`} 
                    alt={item.name}
                    className={`w-16 h-16 object-contain rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>
                      {item.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${item.price.toFixed(2)} each
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded px-2 py-1`}>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[1.5rem] text-center`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Total:
              </span>
              <span className="text-xl font-bold text-primary">
                ${getTotal().toFixed(2)}
              </span>
            </div>
            <button 
              className="w-full bg-primary hover:bg-accent text-white py-2 px-4 rounded-lg transition-colors font-medium"
              onClick={() => {
                alert('Checkout functionality coming soon!');
                onClose();
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
