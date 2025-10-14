import { useCart, CartItem } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const itemPrice = item.discount 
    ? item.price * (1 - item.discount)
    : item.price;
  
  const itemTotal = itemPrice * item.quantity;

  return (
    <div 
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 transform hover:-translate-y-1 transition-all`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div className={`flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 w-full md:w-32 h-32`}>
          <img
            src={`/${item.imgName}`}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                {item.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {item.description}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                {item.discount && (
                  <span className="text-sm text-gray-500 line-through">
                    ${item.price.toFixed(2)}
                  </span>
                )}
                <span className={`text-xl font-bold ${darkMode ? 'text-primary' : 'text-primary'}`}>
                  ${itemPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Controls and Remove Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2`}>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>
              <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                ${itemTotal.toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                aria-label={`Remove ${item.name} from cart`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
