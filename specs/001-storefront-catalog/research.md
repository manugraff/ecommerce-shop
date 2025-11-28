# Phase 0: Research & Technical Decisions

**Feature**: Storefront Catalog and Cart  
**Date**: 2025-11-22  
**Purpose**: Resolve technical unknowns and establish implementation patterns before design phase

---

## R1: localStorage Cart Persistence

### Decision: Structured JSON with metadata

**Rationale**: localStorage is synchronous, string-based storage with 5-10MB limits across browsers. Need efficient serialization, error handling, and data validation.

**Implementation Pattern**:
```typescript
// Structure stored in localStorage
interface CartStorage {
  version: string;           // Schema version (e.g., "1.0")
  items: CartItemDTO[];      // Array of cart items
  lastUpdated: string;       // ISO8601 timestamp
}

// Key: 'ecommerce-cart'
// Max size: Conservative 5MB limit (track serialized size)
```

**Best Practices**:
1. **Wrap all access in try-catch** - localStorage can throw (QuotaExceededError, SecurityError if disabled)
2. **Validate on restore** - Use Zod schema to validate structure before hydrating cart
3. **Version schema** - Include version field to handle future migrations
4. **Debounce writes** - Don't persist on every state change; use 500ms debounce
5. **Track size** - Monitor serialized JSON size, warn if approaching 5MB
6. **Graceful degradation** - If localStorage fails, cart works in-memory only (warn user)

**Alternatives Considered**:
- SessionStorage: Rejected (doesn't persist across browser closes)
- IndexedDB: Rejected (overkill for simple cart, async complexity)
- Cookies: Rejected (4KB limit too small, sent with every request)

**Code Example**:
```typescript
const CART_STORAGE_KEY = 'ecommerce-cart';
const CART_VERSION = '1.0';

export const CartStorageService = {
  save(cart: CartStateDTO): void {
    try {
      const storage: CartStorage = {
        version: CART_VERSION,
        items: cart.items,
        lastUpdated: new Date().toISOString()
      };
      const serialized = JSON.stringify(storage);
      
      // Check size (conservative 5MB limit)
      if (serialized.length > 5 * 1024 * 1024) {
        console.warn('Cart exceeds 5MB localStorage limit');
        return;
      }
      
      localStorage.setItem(CART_STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Cart continues to work in-memory
    }
  },
  
  load(): CartStateDTO | null {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return null;
      
      const parsed: CartStorage = JSON.parse(stored);
      
      // Validate version
      if (parsed.version !== CART_VERSION) {
        console.warn('Cart schema version mismatch, clearing');
        this.clear();
        return null;
      }
      
      // Validate structure (use Zod in real implementation)
      if (!Array.isArray(parsed.items)) {
        throw new Error('Invalid cart structure');
      }
      
      return {
        items: parsed.items,
        subtotal: calculateSubtotal(parsed.items),
        itemCount: calculateItemCount(parsed.items)
      };
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      this.clear(); // Clear corrupted data
      return null;
    }
  },
  
  clear(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  }
};
```

---

## R2: TanStack Query Configuration

### Decision: Conservative caching with background refetch

**Rationale**: Product catalog changes infrequently but should stay fresh. Balance between performance (cache hits) and data freshness (background updates).

**Configuration**:
```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes (data considered fresh)
      cacheTime: 10 * 60 * 1000,       // 10 minutes (keep in cache)
      refetchOnWindowFocus: true,       // Refetch when user returns to tab
      refetchOnReconnect: true,         // Refetch when network reconnects
      retry: 1,                         // Retry failed requests once
      retryDelay: 1000,                 // 1 second delay before retry
    }
  }
});

// Override for categories (rarely change)
const categoriesQueryOptions = {
  staleTime: 60 * 60 * 1000,     // 1 hour
  cacheTime: 2 * 60 * 60 * 1000  // 2 hours
};
```

**Query Keys Pattern**:
```typescript
// Consistent, hierarchical query keys
const queryKeys = {
  products: {
    all: ['products'] as const,
    byCategory: (categoryId: string) => ['products', 'category', categoryId] as const,
    detail: (id: string) => ['products', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  }
};

// Usage in hooks
useQuery(queryKeys.products.all, ProductService.list);
useQuery(queryKeys.products.byCategory(catId), () => ProductService.listByCategory(catId));
useQuery(queryKeys.products.detail(id), () => ProductService.getById(id));
useQuery(queryKeys.categories.all, CategoryService.list, categoriesQueryOptions);
```

**Best Practices**:
1. **Hierarchical keys** - Enable partial invalidation (invalidate all product queries)
2. **Background refetch** - Keep data fresh without blocking UI
3. **Optimistic updates** - Not needed for read-only storefront (useful later for cart sync)
4. **Error boundaries** - Wrap components in ErrorBoundary to catch query failures
5. **Loading states** - Always handle `isLoading` and `isError` states

**Alternatives Considered**:
- Longer stale times (15+ min): Rejected (users expect fresh pricing)
- No caching: Rejected (unnecessary API load, poor UX)
- Aggressive refetching: Rejected (wasteful, backend load)

---

## R3: Product Search Implementation

### Decision: Client-side filtering with debounce

**Rationale**: With ~100 products in Phase 1, client-side search is simpler and faster than API calls. No backend search endpoint needed.

**Implementation**:
```typescript
// hooks/use-product-search.ts
import { useState, useMemo } from 'react';
import { useDebounce } from '@/lib/use-debounce'; // Custom debounce hook

export function useProductSearch(products: ProductDTO[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300); // 300ms debounce
  
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) return products;
    
    const query = debouncedQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.brand?.name.toLowerCase().includes(query)
    );
  }, [products, debouncedQuery]);
  
  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    isSearching: searchQuery !== debouncedQuery, // True during debounce
  };
}
```

**Debounce Implementation**:
```typescript
// lib/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

**Performance Considerations**:
- **100 products**: ~1-2ms filter time (negligible)
- **300ms debounce**: Prevents excessive re-renders while typing
- **useMemo**: Caches filter results unless products or query changes
- **Future**: If catalog grows >500 products, migrate to backend search endpoint

**Alternatives Considered**:
- Backend search API: Rejected (adds latency, unnecessary for small catalog)
- No debounce: Rejected (filters on every keystroke, poor UX)
- Longer debounce (500ms+): Rejected (feels sluggish)

---

## R4: Category Filtering with React Router

### Decision: URL query parameters with useSearchParams

**Rationale**: Query params preserve filter state in URL for bookmarking/sharing without creating complex nested routes.

**Implementation**:
```typescript
// Pattern: /?category=uuid-123
// OR: /category/uuid-123 (path param, cleaner URLs)

// Option 1: Query params (more flexible for multi-filter future)
import { useSearchParams } from 'react-router-dom';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const handleCategorySelect = (catId: string | null) => {
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({}); // Clear filter
    }
  };
  
  // Use appropriate hook based on filter
  const { data: products } = categoryId 
    ? useProductsByCategory(categoryId)
    : useProducts();
    
  return (
    <CategoryFilter 
      categories={categories}
      activeCategory={categoryId}
      onSelect={handleCategorySelect}
    />
    <ProductGrid products={products} />
  );
}

// Option 2: Path params (cleaner URLs, separate route)
// Route: <Route path="/category/:categoryId" element={<CategoryPage />} />
// Navigate: navigate(`/category/${catId}`)
```

**Decision**: Use **path params** (`/category/:categoryId`) for cleaner URLs and natural navigation flow. Reserve query params for future multi-filter (category + brand + price range).

**Final Pattern**:
```typescript
// Routes
<Route path="/" element={<HomePage />} />                        // All products
<Route path="/category/:categoryId" element={<CategoryPage />} />  // Filtered

// CategoryPage component
function CategoryPage() {
  const { categoryId } = useParams();
  const { data: products } = useProductsByCategory(categoryId!);
  const { data: category } = useCategory(categoryId!); // For breadcrumb
  
  return (
    <>
      <Breadcrumb items={['Home', category?.name]} />
      <ProductGrid products={products} />
    </>
  );
}
```

**Alternatives Considered**:
- Query params: Deferred to future multi-filter feature
- Client-side only (no URL sync): Rejected (can't share/bookmark filters)

---

## R5: BRL Currency Formatting with React Intl

### Decision: React Intl with pt-BR locale

**Rationale**: React Intl provides robust, locale-aware number/currency formatting. Handles BRL symbol (R$), thousands separators, decimal places.

**Setup**:
```typescript
// main.tsx
import { IntlProvider } from 'react-intl';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntlProvider locale="pt-BR" defaultLocale="pt-BR">
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <App />
        </CartProvider>
      </QueryClientProvider>
    </IntlProvider>
  </React.StrictMode>
);
```

**Usage in Components**:
```typescript
import { useIntl } from 'react-intl';

function ProductCard({ product }: { product: ProductDTO }) {
  const intl = useIntl();
  
  const formattedPrice = intl.formatNumber(product.price, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">{formattedPrice}</p> {/* R$ 89,90 */}
    </div>
  );
}
```

**Helper Utility** (optional, for consistency):
```typescript
// lib/format-currency.ts
import { IntlShape } from 'react-intl';

export function formatBRL(amount: number, intl: IntlShape): string {
  return intl.formatNumber(amount, {
    style: 'currency',
    currency: 'BRL'
  });
}

// Usage: const price = formatBRL(product.price, intl);
```

**Output Examples**:
- `89.90` → `R$ 89,90`
- `1250.50` → `R$ 1.250,50`
- `0.99` → `R$ 0,99`

**Alternatives Considered**:
- Manual formatting (`R$ ${price.toFixed(2)}`): Rejected (doesn't handle thousands separator, not locale-aware)
- Intl.NumberFormat (native): Considered (works, but React Intl provides hooks and consistent API)

---

## R6: Product Image Placeholders

### Decision: Lucide icon-based placeholder with gradient background

**Rationale**: Beauty/cosmetics domain benefits from elegant, minimalist placeholders. Lucide icons provide "Package" or "Image" icons suitable for product cards.

**Implementation**:
```typescript
import { Package } from 'lucide-react';

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <img 
        src={src} 
        alt={alt}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }
  
  // Placeholder
  return (
    <div className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-t-lg flex items-center justify-center">
      <Package className="w-16 h-16 text-neutral-400" strokeWidth={1.5} />
    </div>
  );
}
```

**Design Aesthetic**:
- Gradient background (neutral-100 to neutral-200) - soft, clean
- Large Lucide icon (Package or Sparkles for beauty theme)
- Maintains aspect ratio with product images (4:3 or 1:1)

**Alternatives Considered**:
- External placeholder service (placeholder.com): Rejected (external dependency, slower)
- Solid color background: Considered (works, but gradient feels more premium)
- Custom SVG: Rejected (overkill, Lucide icons sufficient)

---

## R7: Responsive Tailwind Grid for Product Cards

### Decision: CSS Grid with responsive breakpoints

**Rationale**: Tailwind's grid utilities provide clean, responsive layouts. Mobile-first approach ensures good UX on all devices.

**Implementation**:
```typescript
// ProductGrid component
function ProductGrid({ products }: { products: ProductDTO[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Breakpoint Strategy**:
- **Mobile (default)**: 1 column (full width cards)
- **Tablet (sm: 640px)**: 2 columns
- **Desktop (lg: 1024px)**: 3 columns
- **Large desktop (xl: 1280px)**: 4 columns

**Card Aspect Ratio**:
```typescript
function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image: 4:3 aspect ratio */}
      <div className="aspect-[4/3] bg-neutral-100">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        <p className="text-sm text-neutral-600">{product.brand?.name}</p>
        <p className="text-xl font-bold mt-2">{formatPrice(product.price)}</p>
        <Button className="w-full mt-4">Add to Cart</Button>
      </div>
    </div>
  );
}
```

**Performance Considerations**:
- **aspect-[4/3]**: Prevents layout shift while images load
- **line-clamp-2**: Truncates long product names (2 lines max)
- **gap-6**: Consistent spacing between cards
- **hover:shadow-lg**: Subtle interaction feedback

**Alternatives Considered**:
- Flexbox: Rejected (CSS Grid simpler for equal-width columns)
- Fixed card heights: Rejected (content varies, causes awkward whitespace)
- Masonry layout: Rejected (complex, not needed for uniform product cards)

---

## Summary of Research Decisions

| Research Area | Decision | Rationale |
|---------------|----------|-----------|
| **localStorage** | Structured JSON with version, validation, debounced writes | Reliability, error handling, future migration support |
| **TanStack Query** | 5min stale, 10min cache, background refetch | Balance freshness and performance |
| **Search** | Client-side filtering with 300ms debounce | Sufficient for ~100 products, simpler than API |
| **Category Filter** | URL path params (`/category/:id`) | Clean URLs, bookmarkable, natural navigation |
| **Currency** | React Intl with pt-BR locale | Locale-aware, handles separators, consistent |
| **Placeholders** | Lucide icon + gradient background | Elegant, lightweight, brand-appropriate |
| **Grid Layout** | Tailwind CSS Grid, mobile-first breakpoints | Responsive, performant, clean code |

All research decisions documented. Ready for Phase 1: Design & Contracts.
