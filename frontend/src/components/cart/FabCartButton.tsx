import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function FabCartButton() {
  const { totalItems } = useCart();
  const { darkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    setPrevCount(totalItems);
  }, [totalItems, prevCount]);

  return (
    <Link
      to="/cart"
      className="relative group"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <div className={`p-2 rounded-full transition-all duration-300 ${
        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
      } group-hover:animate-shake`}>
        {/* Shopping Bag Icon */}
        <svg
          className={`w-6 h-6 ${darkMode ? 'text-light' : 'text-gray-700'} transition-colors`}
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
      </div>

      {/* Animated Badge */}
      {totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ${
            isAnimating ? 'animate-bounce scale-125' : 'scale-100'
          }`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
