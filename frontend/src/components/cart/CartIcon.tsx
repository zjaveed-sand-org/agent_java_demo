import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const { darkMode } = useTheme();
  const itemCount = getItemCount();

  return (
    <Link
      to="/cart"
      className="relative inline-block transform transition-transform duration-200 hover:scale-105"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Traditional Shopping Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${darkMode ? 'text-light' : 'text-gray-700'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge with item count */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
