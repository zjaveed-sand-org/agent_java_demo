import { CartItem } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartGridItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartGridItem({ item, onUpdateQuantity, onRemove }: CartGridItemProps) {
  const { darkMode } = useTheme();
  const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
  const lineTotal = itemPrice * item.quantity;

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl flex flex-col`}
    >
      <div className={`relative h-48 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'}`}>
        <img src={`/${item.imgName}`} alt={item.name} className="w-full h-full object-contain p-4" />
        {item.discount && (
          <div className="absolute top-4 left-0 bg-primary text-white px-3 py-1 text-sm font-semibold shadow-md">
            {Math.round(item.discount * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
          {item.name}
        </h3>

        <div className="space-y-3 mt-auto">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ${itemPrice.toFixed(2)} each
            </span>
            <span className="text-primary text-xl font-bold">${lineTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
              <button
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                className={`w-8 h-8 flex items-center justify-center ${
                  darkMode ? 'text-light' : 'text-gray-700'
                } hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded`}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                -
              </button>
              <span
                className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2.5rem] text-center font-semibold`}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className={`w-8 h-8 flex items-center justify-center ${
                  darkMode ? 'text-light' : 'text-gray-700'
                } hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded`}
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>

            <button
              onClick={() => onRemove(item.productId)}
              className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
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
              <span className="text-sm font-medium">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
