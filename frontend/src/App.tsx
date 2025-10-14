import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Products from './components/entity/product/Products';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import AdminProducts from './components/admin/AdminProducts';
import { useTheme } from './context/ThemeContext';
import CartPage from './components/cart/CartPage';
import FabCartButton from './components/cart/FabCartButton';
import CartDrawer from './components/cart/CartDrawer';

// Wrapper component to apply theme classes
function ThemedApp() {
  const { darkMode } = useTheme();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </main>
        <Footer />
        <FabCartButton onClick={() => setIsCartDrawerOpen(true)} />
        <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ThemedApp />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
