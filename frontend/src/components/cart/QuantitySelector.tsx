import { useTheme } from '../../context/ThemeContext';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  productName: string;
  size?: 'small' | 'large';
}

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  productName,
  size = 'small'
}: QuantitySelectorProps) {
  const { darkMode } = useTheme();
  
  const isLarge = size === 'large';
  const buttonClasses = isLarge 
    ? 'w-12 h-12 text-xl' 
    : 'w-8 h-8 text-base';
  const containerClasses = isLarge 
    ? 'p-2 gap-4' 
    : 'p-1 gap-3';
  const quantityClasses = isLarge 
    ? 'min-w-[3rem] text-xl font-semibold' 
    : 'min-w-[2rem] text-base';

  return (
    <div
      className={`flex items-center ${containerClasses} ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      } rounded-lg transition-colors duration-300`}
    >
      <button
        onClick={onDecrease}
        className={`${buttonClasses} flex items-center justify-center ${
          darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-300'
        } hover:text-primary transition-all duration-200 rounded-lg transform hover:scale-110 active:scale-95`}
        aria-label={`Decrease quantity of ${productName}`}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span
        className={`${quantityClasses} ${
          darkMode ? 'text-light' : 'text-gray-800'
        } text-center transition-colors duration-300`}
        aria-label={`Quantity of ${productName}`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`${buttonClasses} flex items-center justify-center ${
          darkMode ? 'text-light hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-300'
        } hover:text-primary transition-all duration-200 rounded-lg transform hover:scale-110 active:scale-95`}
        aria-label={`Increase quantity of ${productName}`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
