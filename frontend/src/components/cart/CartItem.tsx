import { useState, useRef, useEffect } from 'react';
import { useCart, CartItem as CartItemType } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.quantity.toString());
  const [isDragging, setIsDragging] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const touchStartX = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const itemPrice = item.discount
    ? item.price * (1 - item.discount)
    : item.price;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity(item.productId, newQuantity);
  };

  const handleEditSubmit = () => {
    const newQuantity = parseInt(editValue, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(item.productId, newQuantity);
    } else {
      setEditValue(item.quantity.toString());
    }
    setIsEditing(false);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.productId);
    }, 300);
  };

  // Touch handlers for swipe-to-delete
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    if (diff > 0 && diff < 150) {
      setSwipeX(-diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeX < -100) {
      handleRemove();
    } else {
      setSwipeX(0);
    }
  };

  return (
    <div
      className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      } ${isRemoving ? 'animate-slideOutLeft' : ''}`}
      style={{ transform: `translateX(${swipeX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag Handle - Desktop */}
      <div
        className={`hidden md:flex absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing ${
          darkMode ? 'text-gray-600' : 'text-gray-400'
        }`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        title="Drag to reorder (visual only)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      <div className="p-4 md:pl-12 flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className={`flex-shrink-0 w-full sm:w-32 h-32 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg flex items-center justify-center`}>
          <img
            src={`/${item.imgName}`}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                {item.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {item.description}
              </p>
            </div>
            <button
              onClick={handleRemove}
              className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
              aria-label={`Remove ${item.name} from cart`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="flex items-center">
              {item.discount && (
                <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`}>
                  ${item.price.toFixed(2)}
                </span>
              )}
              <span className="text-primary text-xl font-bold">
                ${itemPrice.toFixed(2)}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="number"
                    min="1"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleEditSubmit}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEditSubmit();
                      }
                    }}
                    className={`w-12 text-center ${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded px-1`}
                  />
                ) : (
                  <span
                    onClick={() => setIsEditing(true)}
                    className={`min-w-[3rem] text-center cursor-pointer ${darkMode ? 'text-light hover:text-primary' : 'text-gray-800 hover:text-primary'} transition-colors font-medium`}
                    title="Click to edit"
                  >
                    {item.quantity}
                  </span>
                )}
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                ${(itemPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Delete Indicator */}
      {swipeX < -50 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      )}
    </div>
  );
}
