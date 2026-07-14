import { Link } from 'react-router-dom';
import { useCart, unitPrice } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';

export default function Cart() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { darkMode } = useTheme();

  const containerClass = `min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`;
  const headingClass = `text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`;
  const cardClass = `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-300`;

  if (items.length === 0) {
    return (
      <div className={containerClass}>
        <div className="max-w-3xl mx-auto">
          <h1 className={headingClass}>My Cart</h1>
          <div className={`${cardClass} mt-6 p-10 flex flex-col items-center text-center space-y-4`}>
            <svg
              className={`h-16 w-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your cart is empty.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={headingClass}>My Cart</h1>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const itemUnitPrice = unitPrice(item);
              const lineTotal = itemUnitPrice * item.quantity;
              return (
                <div
                  key={item.productId}
                  className={`${cardClass} p-4 flex items-center gap-4`}
                  data-testid={`cart-item-${item.productId}`}
                >
                  <div className={`h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <img
                      src={`/${item.imgName}`}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {item.name}
                    </h3>
                    <div className="mt-1">
                      {item.discount ? (
                        <span>
                          <span className="text-gray-500 line-through text-sm mr-2">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-primary font-bold">
                            ${itemUnitPrice.toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-primary font-bold">
                          ${itemUnitPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                      aria-label={`Decrease quantity of ${item.name}`}
                      id={`cart-decrease-qty-${item.productId}`}
                    >
                      <span aria-hidden="true">-</span>
                    </button>
                    <span
                      className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
                      aria-label={`Quantity of ${item.name}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                      aria-label={`Increase quantity of ${item.name}`}
                      id={`cart-increase-qty-${item.productId}`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>

                  <div className="text-right w-24 flex-shrink-0">
                    <p className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${lineTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-600 text-sm mt-1 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                      id={`cart-remove-${item.productId}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
            >
              Clear cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className={`${cardClass} p-6 space-y-4 lg:sticky lg:top-24`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Order Summary
              </h2>
              <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold" data-testid="cart-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-primary hover:bg-accent text-white px-4 py-3 rounded-lg font-medium transition-colors"
                id="cart-checkout"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className={`block text-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
