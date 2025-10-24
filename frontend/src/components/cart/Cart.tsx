import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import QuantitySelector from './QuantitySelector';
import axios from 'axios';
import { api } from '../../api/config';

interface Supplier {
  supplierId: number;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { darkMode } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [suppliers, setSuppliers] = useState<Record<number, Supplier>>({});

  // Fetch supplier information
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get<Supplier[]>(`${api.baseURL}${api.endpoints.suppliers}`);
        const supplierMap = data.reduce((acc, supplier) => {
          acc[supplier.supplierId] = supplier;
          return acc;
        }, {} as Record<number, Supplier>);
        setSuppliers(supplierMap);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const toggleExpanded = (productId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>
            Shopping Cart
          </h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-12 text-center`}>
            <svg
              className={`mx-auto h-24 w-24 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Your cart is empty
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start adding items to your cart to see them here
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} text-sm font-medium transition-colors`}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const supplier = suppliers[item.supplierId];
              const isExpanded = expandedItems.has(item.productId);
              const price = item.discount ? item.price * (1 - item.discount) : item.price;

              return (
                <div
                  key={item.productId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 flex-shrink-0`}>
                        <img
                          src={`/${item.imgName}`}
                          alt={item.name}
                          className="w-32 h-32 object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                SKU: {item.sku}
                              </span>
                              {supplier && (
                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                                  Supplier: {supplier.name}
                                </span>
                              )}
                              {item.discount && (
                                <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                                  {Math.round(item.discount * 100)}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors p-2`}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                          {item.description}
                        </p>

                        {/* Price and Quantity Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <QuantitySelector
                              quantity={item.quantity}
                              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                              productName={item.name}
                              size="large"
                            />
                          </div>
                          <div className="text-right">
                            {item.discount ? (
                              <div>
                                <div className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </div>
                                <div className="text-2xl font-bold text-primary">
                                  ${(price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xl font-bold text-primary">
                                ${(price * item.quantity).toFixed(2)}
                              </div>
                            )}
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              ${price.toFixed(2)} per {item.unit}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details Section */}
                        {supplier && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleExpanded(item.productId)}
                              className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} transition-colors`}
                            >
                              <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
                              <svg
                                className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isExpanded && (
                              <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} space-y-2 animate-in slide-in-from-top-2`}>
                                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                  Supplier Information
                                </h4>
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                                  <p><span className="font-medium">Contact:</span> {supplier.contactPerson}</p>
                                  <p><span className="font-medium">Email:</span> {supplier.email}</p>
                                  <p><span className="font-medium">Phone:</span> {supplier.phone}</p>
                                  {supplier.description && (
                                    <p className="mt-2">{supplier.description}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24`}>
              <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Shipping
                  </span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Tax (estimated)
                  </span>
                  <span className={darkMode ? 'text-light' : 'text-gray-800'}>
                    ${(totalPrice * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mb-6`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${(totalPrice * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} text-sm font-medium transition-colors`}
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
