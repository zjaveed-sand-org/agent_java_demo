import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartSummaryCard() {
  const { getSubtotal, getShipping, getTotal } = useCart();
  const { darkMode } = useTheme();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const isFreeShipping = shipping === 0 && subtotal > 0;

  return (
    <div 
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-md p-6`}
    >
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6`}>
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal:</span>
          <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping:</span>
          <span className={`font-semibold ${isFreeShipping ? 'text-primary' : darkMode ? 'text-light' : 'text-gray-800'}`}>
            {isFreeShipping ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
          <div className="flex justify-between items-center">
            <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total:</span>
            <span className={`text-2xl font-bold text-primary`}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg">
          Proceed to Checkout
        </button>
        <Link 
          to="/products"
          className={`block text-center ${darkMode ? 'text-primary' : 'text-primary'} hover:underline`}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
