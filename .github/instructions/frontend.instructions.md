---
applyTo: "frontend/**/*"
---

# Frontend Development Guidelines

## Project Information

- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Port**: 5137 (dev), 80/443 (production)

## Internationalization (i18n) Requirements

**All user-facing text must support four languages: English, German, Spanish, and Chinese.**

### i18n Standards

- **Languages**: 
  - English (en) - Primary language
  - German (de) - German
  - Spanish (es) - Spanish
  - Chinese (zh) - Simplified Chinese
- **Library**: Use `react-i18next` or similar i18n library
- **Translation Keys**: Use descriptive dot-notation keys (e.g., `product.name`, `order.status.pending`)
- **Default Language**: English (en)
- **Language Detection**: Auto-detect from browser, allow manual selection

### Translation File Structure

```
frontend/src/locales/
  en/
    common.json
    products.json
    orders.json
  de/
    common.json
    products.json
    orders.json
  es/
    common.json
    products.json
    orders.json
  zh/
    common.json
    products.json
    orders.json
```

### Translation Best Practices

- **Never Hardcode Text**: All user-facing strings must use translation keys
- **Namespace by Feature**: Organize translations by feature/module
- **Pluralization**: Use proper plural forms for each language
- **Date/Time Formatting**: Use locale-specific formatting (e.g., `Intl.DateTimeFormat`)
- **Number Formatting**: Use locale-specific number formatting
- **RTL Support**: While not required for current languages, structure code to support RTL if needed later

### Translation Key Conventions

```typescript
// Good: Using translation keys
import { useTranslation } from 'react-i18next';

function ProductCard({ product }) {
  const { t } = useTranslation('products');
  
  return (
    <div>
      <h3>{t('card.title')}</h3>
      <p>{t('card.price')}: {formatCurrency(product.price)}</p>
      <button>{t('card.addToCart')}</button>
    </div>
  );
}

// Bad: Hardcoded text
function ProductCard({ product }) {
  return (
    <div>
      <h3>Product Name</h3>
      <p>Price: ${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

### Language-Specific Considerations

- **German**: Compound words, formal/informal forms, longer text strings
- **Spanish**: Gender agreement, accent marks, inverted punctuation
- **Chinese**: No spaces between words, character length vs. byte length, vertical text support

### Locale Utilities

```typescript
// Format currency with locale
const formatCurrency = (amount: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'zh' ? 'CNY' : locale === 'es' ? 'EUR' : 'USD'
  }).format(amount);
};

// Format date with locale
const formatDate = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
```

## React and TypeScript Best Practices

### Component Structure

- **Functional Components**: Always use functional components with hooks
- **TypeScript First**: Define proper types and interfaces for all props and state
- **Single Responsibility**: Each component should have one clear purpose
- **Composition Over Inheritance**: Build complex UIs from simple components

### File Organization

```
components/
  ComponentName/
    ComponentName.tsx       # Main component
    ComponentName.test.tsx  # Tests
    index.ts                # Export
  common/                   # Shared components
  features/                 # Feature-specific components
```

### Naming Conventions

- **Components**: `PascalCase` (e.g., `ProductCard`, `OrderList`)
- **Files**: Match component name (e.g., `ProductCard.tsx`)
- **Hooks**: Start with `use` (e.g., `useAuth`, `useProducts`)
- **Utilities**: `camelCase` (e.g., `formatCurrency`, `validateEmail`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_ITEMS`)
- **Types/Interfaces**: `PascalCase` with `I` prefix for interfaces (e.g., `IProduct`, `OrderStatus`)

### TypeScript Guidelines

- **Strict Mode**: Enable strict TypeScript checking
- **No Any**: Avoid `any` type; use proper typing or `unknown`
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections
- **Props Interface**: Always define props interface for components

```typescript
// Good: Properly typed component
interface IProductCardProps {
  product: IProduct;
  onAddToCart: (productId: number) => void;
  isLoading?: boolean;
}

const ProductCard: React.FC<IProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isLoading = false 
}) => {
  // Component implementation
};

// Avoid: Using any
const ProductCard = (props: any) => { }; // Don't do this
```

### State Management

- **useState**: For local component state
- **useReducer**: For complex state logic
- **Context API**: For app-wide state (auth, theme, language)
- **Avoid Prop Drilling**: Use Context or state management library

```typescript
// Good: Using Context for shared state
import { useAuth } from '@/context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
}
```

### Hooks Best Practices

- **Custom Hooks**: Extract reusable logic into custom hooks
- **Dependency Arrays**: Always specify dependencies correctly
- **Hook Order**: Never call hooks conditionally
- **Cleanup**: Return cleanup functions from useEffect when needed

```typescript
// Good: Custom hook with proper dependencies
function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}
```

## Styling with Tailwind CSS

### Tailwind Best Practices

- **Utility First**: Use Tailwind utility classes
- **Component Classes**: Extract repeated patterns into components
- **Responsive Design**: Mobile-first approach with responsive modifiers
- **Dark Mode**: Support dark mode using Tailwind's dark mode utilities
- **Custom Colors**: Define custom colors in `tailwind.config.js`

```typescript
// Good: Tailwind with responsive design
<div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
    {t('welcome.title')}
  </h1>
</div>

// Avoid: Inline styles
<div style={{ padding: '1rem', backgroundColor: 'white' }}>
  <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Title</h1>
</div>
```

### CSS Organization

- Keep custom CSS minimal; prefer Tailwind utilities
- Use `@apply` directive sparingly for repeated patterns
- Define theme customizations in `tailwind.config.js`

## API Integration

### API Client Setup

- **Centralized Config**: Keep API configuration in `src/api/config.ts`
- **Base URL**: Use environment variables for API base URL
- **Error Handling**: Implement global error handling
- **Loading States**: Always handle loading and error states

```typescript
// Good: Centralized API configuration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

### Data Fetching Pattern

```typescript
// Good: Complete data fetching with states
function ProductList() {
  const { t } = useTranslation('products');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<IProduct[]>('/products');
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{t('common.error')}: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Performance Optimization

- **Code Splitting**: Use `React.lazy()` and `Suspense` for route-based splitting
- **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
- **Virtualization**: Use virtual scrolling for long lists
- **Image Optimization**: Use appropriate formats and lazy loading

```typescript
// Good: Code splitting with lazy loading
import { lazy, Suspense } from 'react';

const AdminProducts = lazy(() => import('./components/admin/AdminProducts'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminProducts />
    </Suspense>
  );
}

// Good: Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## Form Handling

- **Controlled Components**: Use controlled inputs with state
- **Validation**: Validate on submit and provide clear error messages
- **Accessibility**: Include proper labels and ARIA attributes
- **i18n**: Translate all form labels, placeholders, and error messages

```typescript
// Good: Internationalized form with validation
function ProductForm() {
  const { t } = useTranslation('products');
  const [formData, setFormData] = useState<IProductFormData>({
    name: '',
    price: 0,
    category: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.nameRequired');
    }
    if (formData.price <= 0) {
      newErrors.price = t('form.errors.priceInvalid');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit logic
    try {
      await api.post('/products', formData);
      // Handle success
    } catch (err) {
      setErrors({ submit: t('form.errors.submitFailed') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          {t('form.labels.name')}
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>
      
      <button type="submit" className="btn-primary">
        {t('form.submit')}
      </button>
    </form>
  );
}
```

## Accessibility (a11y)

- **Semantic HTML**: Use proper HTML5 semantic elements
- **ARIA Labels**: Add ARIA labels where needed
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Focus Management**: Manage focus for modals and dynamic content
- **Color Contrast**: Ensure sufficient color contrast ratios

```typescript
// Good: Accessible button with internationalization
<button
  onClick={handleDelete}
  aria-label={t('actions.deleteProduct', { name: product.name })}
  className="btn-danger"
>
  {t('actions.delete')}
</button>
```

## Testing

### Unit Testing

- **Test Files**: Co-locate tests with components (`.test.tsx`)
- **Test Names**: Describe what is being tested
- **Test Coverage**: Aim for 80%+ coverage
- **Mock API Calls**: Mock external dependencies

```typescript
// Good: Component test with i18n
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/test-config';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('should render product name and price', () => {
    const product = { id: 1, name: 'Test Product', price: 99.99 };
    
    render(
      <I18nextProvider i18n={i18n}>
        <ProductCard product={product} />
      </I18nextProvider>
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/99.99/)).toBeInTheDocument();
  });
});
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Code Review Checklist

Before submitting code:
- [ ] All user-facing text uses i18n translation keys
- [ ] Translations provided for all four languages (en, de, es, zh)
- [ ] TypeScript strict mode enabled, no `any` types
- [ ] Components properly typed with interfaces
- [ ] Responsive design implemented (mobile-first)
- [ ] Dark mode support included
- [ ] API calls include loading and error states
- [ ] Accessibility attributes added (ARIA labels, semantic HTML)
- [ ] Tests written and passing
- [ ] No console errors or warnings
- [ ] Code follows naming conventions
- [ ] Performance optimizations applied (memoization, code splitting)
