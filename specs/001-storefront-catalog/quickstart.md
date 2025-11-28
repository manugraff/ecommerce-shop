# Quickstart Guide: Storefront Catalog and Cart

**Feature**: 001-storefront-catalog  
**Date**: 2025-11-22  
**Target Audience**: Developers implementing or testing this feature

---

## Prerequisites

Before starting, ensure you have:

- [x] **Node.js** v18+ installed (`node --version`)
- [x] **npm** or **yarn** package manager
- [x] **Git** for version control
- [x] **Backend API** running at `http://localhost:3000` with populated product data
- [x] **Modern browser** (Chrome, Firefox, Safari, Edge - latest 2 versions)

---

## 1. Environment Setup

### Clone Repository (if not already)

```bash
git clone <repository-url>
cd ecommerce-shop
```

### Checkout Feature Branch

```bash
git checkout 001-storefront-catalog
```

### Configure Environment Variables

Create `.env` file in project root:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:3000

# Optional: Enable query devtools in development
VITE_QUERY_DEVTOOLS=true
```

**Important**: Vite requires `VITE_` prefix for environment variables to be accessible in client code.

---

## 2. Install Dependencies

```bash
npm install
```

**Key Dependencies** (verify in `package.json`):
- React v19+
- TypeScript v5.9+
- TanStack Query v5
- React Router DOM v7
- Axios v1.12+
- Tailwind CSS v4
- React Hook Form + Zod
- React Intl

---

## 3. Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open browser to `http://localhost:5173/`

---

## 4. Verify Backend Connection

### Test API Endpoints Manually

**Option 1: Browser**
- Navigate to `http://localhost:3000/products`
- Should see JSON array of products

**Option 2: curl**
```bash
# List products
curl http://localhost:3000/products

# List categories
curl http://localhost:3000/categories

# Get single product (replace UUID)
curl http://localhost:3000/products/550e8400-e29b-41d4-a716-446655440000
```

**Expected**: JSON responses with product/category data

### Troubleshooting Backend Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start backend: `cd backend && npm run start:dev` |
| "404 Not Found" | Verify endpoint URLs match backend routes |
| CORS errors | Check backend `enableCors()` includes `http://localhost:5173` |
| Empty arrays | Seed database: `cd backend && npm run seed` |

---

## 5. Feature Testing Scenarios

### Scenario 1: Browse Product Catalog (P1)

**User Story**: Customer views all available products

**Steps**:
1. Navigate to homepage (`http://localhost:5173/`)
2. Wait for products to load (should see loading skeleton)
3. Verify product grid displays with:
   - Product cards in responsive grid (1 col mobile, 2 tablet, 3-4 desktop)
   - Each card shows: image/placeholder, name, brand, price (BRL format)
   - Prices formatted as "R$ XX,XX"

**Expected Result**: ✅ All active products visible with correct formatting

**Failure Cases**:
- ❌ "No products available" → Backend not running or no products in DB
- ❌ Infinite loading → Check browser console for API errors
- ❌ Incorrect prices → Verify React Intl locale set to `pt-BR`

---

### Scenario 2: Filter by Category (P2)

**User Story**: Customer filters products by category

**Steps**:
1. From homepage, locate category filter (sidebar or menu)
2. Verify all categories load from API
3. Click on a category (e.g., "Skincare")
4. Observe URL change to `/category/:categoryId`
5. Verify only products from that category display
6. Click "All Products" or navigate to `/`
7. Verify full catalog returns

**Expected Result**: ✅ Products filter correctly, URL updates, breadcrumb shows category name

**Failure Cases**:
- ❌ Categories don't load → Check `/categories` endpoint
- ❌ Products don't filter → Verify `categoryId` query param sent correctly
- ❌ Wrong products shown → Backend filtering issue

---

### Scenario 3: View Product Details (P2)

**User Story**: Customer views detailed product information

**Steps**:
1. From product grid, click on any product card
2. Navigate to `/product/:id`
3. Verify detail page shows:
   - Large product image (or placeholder)
   - Full product name
   - Full description (if available)
   - Price (BRL formatted)
   - Brand name
   - Category name
   - "Add to Cart" button
   - "Back to Products" link

**Expected Result**: ✅ All product details display correctly

**Failure Cases**:
- ❌ "Product not found" → Invalid product ID or product deleted
- ❌ Missing fields → Check backend returns full product object
- ❌ Broken image → Verify image URL or placeholder fallback works

---

### Scenario 4: Search Products (P3)

**User Story**: Customer searches for products by name/description

**Steps**:
1. Locate search bar (typically in header)
2. Type "serum" (or any keyword)
3. Observe debounce (300ms delay)
4. Verify results filter to matching products
5. Type gibberish "xyzabc123"
6. Verify "No products found" message
7. Clear search input
8. Verify full catalog returns

**Expected Result**: ✅ Search filters products, debounces input, shows empty state

**Failure Cases**:
- ❌ Search doesn't filter → Check `useProductSearch` hook logic
- ❌ Too many re-renders → Debounce not working (check 300ms delay)
- ❌ Search includes inactive products → Filter should check `active: true`

---

### Scenario 5: Manage Shopping Cart (P1)

**User Story**: Customer adds/removes products, adjusts quantities

**Steps (Add to Cart)**:
1. From product grid or detail page, click "Add to Cart" on a product
2. Verify toast notification "Product added to cart"
3. Observe cart icon badge increment (shows item count)
4. Click cart icon to open cart drawer/page
5. Verify product appears in cart with:
   - Product name, price
   - Quantity: 1
   - Line total = price
   - Subtotal updates

**Steps (Update Quantity)**:
6. In cart, increase quantity (+ button or input)
7. Verify line total updates (quantity × price)
8. Verify subtotal recalculates
9. Verify cart badge count updates

**Steps (Remove Item)**:
10. Click "Remove" on a cart item
11. Verify item disappears
12. Verify subtotal recalculates
13. If cart empty, verify "Your cart is empty" message

**Steps (Persistence)**:
14. Add items to cart
15. Refresh page (`Ctrl+R` or `F5`)
16. Verify cart items persist (loaded from localStorage)
17. Close browser tab, reopen `http://localhost:5173/`
18. Verify cart still contains items

**Expected Result**: ✅ All cart operations work, subtotal accurate, persistence works across sessions

**Failure Cases**:
- ❌ Items don't persist → Check localStorage key `ecommerce-cart` exists
- ❌ Duplicate products → Check add logic increments quantity instead of duplicating
- ❌ Wrong subtotal → Verify calculation logic (sum of lineTotals)
- ❌ Cart breaks on refresh → Check localStorage validation/restoration logic

---

## 6. Development Tools

### React Query Devtools

If enabled (`.env` has `VITE_QUERY_DEVTOOLS=true`), you'll see a floating TanStack Query icon in the bottom-right corner.

**Usage**:
- Click icon to open devtools
- View active queries: `['products']`, `['categories']`, `['products', id]`
- Inspect cache, stale times, fetch status
- Manually refetch or invalidate queries

### Browser DevTools

**localStorage Inspection**:
1. Open DevTools (`F12`)
2. Go to **Application** (Chrome) or **Storage** (Firefox)
3. Expand **Local Storage** → `http://localhost:5173`
4. Find key: `ecommerce-cart`
5. View stored cart data (JSON)

**Network Inspection**:
1. Open DevTools **Network** tab
2. Filter by **Fetch/XHR**
3. Observe API calls:
   - `GET /products` (on homepage load)
   - `GET /categories` (on filter menu load)
   - `GET /products?categoryId=...` (on category filter)
   - `GET /products/:id` (on detail page)

**Console Logging**:
- Check for errors (red text)
- Look for TanStack Query logs (if verbose mode enabled)
- Verify cart operations log correctly

---

## 7. Common Issues & Troubleshooting

### Issue: CORS Errors

**Symptom**: Console shows "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Verify backend has CORS enabled:
   ```typescript
   // NestJS backend: main.ts
   app.enableCors({
     origin: 'http://localhost:5173',
     methods: ['GET'],
   });
   ```
2. Restart backend server
3. Clear browser cache (`Ctrl+Shift+Delete`)

---

### Issue: Environment Variables Not Working

**Symptom**: `import.meta.env.VITE_API_URL` is `undefined`

**Solution**:
1. Verify `.env` file exists in project root (same level as `package.json`)
2. Ensure variable name starts with `VITE_`
3. Restart Vite dev server (`Ctrl+C`, then `npm run dev`)
4. Check `.env` not in `.gitignore` (it should be, create new one)

---

### Issue: Products Not Loading

**Symptom**: Empty grid, "No products available" message

**Solution**:
1. Verify backend running: `curl http://localhost:3000/products`
2. Check backend has data: Seed database if needed
3. Inspect Network tab: Look for failed API calls (404, 500)
4. Check console for errors
5. Verify `VITE_API_URL` points to correct backend

---

### Issue: Cart Doesn't Persist

**Symptom**: Cart clears on page refresh

**Solution**:
1. Open DevTools → Application → Local Storage
2. Check `ecommerce-cart` key exists after adding items
3. Verify browser doesn't have localStorage disabled (private/incognito mode)
4. Check CartContext `useEffect` runs on mount to restore from storage
5. Add console.log to localStorage save/load functions

---

### Issue: Styling Broken / Tailwind Not Working

**Symptom**: No styles, components look unstyled

**Solution**:
1. Verify Tailwind CSS installed: Check `package.json` has `tailwindcss`
2. Check `tailwind.config.js` exists and has correct `content` paths:
   ```js
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
   ```
3. Verify `index.css` imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Restart dev server

---

## 8. Code Structure Overview

```
src/
├── cases/
│   ├── catalog/          # Product browsing feature
│   │   ├── components/   # ProductCard, ProductGrid, etc.
│   │   ├── dtos/         # ProductDTO, CategoryDTO, BrandDTO
│   │   ├── hooks/        # useProducts, useCategories, etc.
│   │   └── services/     # ProductService, CategoryService
│   │
│   └── cart/             # Shopping cart feature
│       ├── components/   # CartDrawer, CartItem, etc.
│       ├── dtos/         # CartItemDTO, CartStateDTO
│       ├── hooks/        # useCartStorage
│       └── context/      # CartContext, CartProvider
│
├── components/
│   ├── layout/           # Header, Footer, MainLayout
│   └── ui/               # shadcn components (Button, Badge, etc.)
│
├── lib/
│   ├── axios.ts          # Axios instance configuration
│   ├── query-client.ts   # TanStack Query client setup
│   └── utils.ts          # Utility functions (cn, etc.)
│
├── App.tsx               # Routes and layout
├── main.tsx              # Entry point (IntlProvider, QueryClientProvider, CartProvider)
└── index.css             # Tailwind imports + global styles
```

---

## 9. Testing Checklist

Before considering feature complete, verify:

- [ ] **P1 Stories**:
  - [ ] Browse product catalog (all active products display)
  - [ ] Manage shopping cart (add, remove, update quantity, persist)
  
- [ ] **P2 Stories**:
  - [ ] Filter products by category (URL updates, breadcrumbs work)
  - [ ] View product details (full info displays, navigation works)
  
- [ ] **P3 Stories**:
  - [ ] Search products (debounced, filters correctly, empty state)

- [ ] **Edge Cases**:
  - [ ] Empty catalog (no products) → Shows empty state
  - [ ] Empty cart → Shows "cart is empty" message
  - [ ] No search results → Shows "no products found"
  - [ ] Backend offline → Shows error message (not infinite loading)
  - [ ] Invalid product ID → 404 error handled gracefully
  - [ ] Duplicate cart additions → Increments quantity (doesn't duplicate)

- [ ] **Responsive Design**:
  - [ ] Mobile (< 640px): 1 column grid
  - [ ] Tablet (640-1024px): 2 columns
  - [ ] Desktop (> 1024px): 3-4 columns

- [ ] **Performance**:
  - [ ] Initial load < 2 seconds (products visible)
  - [ ] Cart operations < 500ms (optimistic UI)
  - [ ] Category filter < 1 second
  - [ ] Search results < 800ms (after debounce)

---

## 10. Next Steps

After verifying all scenarios work:

1. **Review Code Quality**: Ensure all components follow constitution (DTOs-first, service layer, hooks, pure components)
2. **Test Edge Cases**: Try to break the feature (invalid IDs, offline mode, localStorage full)
3. **Performance Check**: Use Lighthouse or React DevTools Profiler
4. **Code Review**: Have team review before merging to main
5. **Prepare for Phase 2**: Plan authentication, checkout, order creation

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format

# Check TypeScript
npm run type-check
```

---

## Support & Documentation

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/api-examples.md](./contracts/api-examples.md)
- **Research Decisions**: [research.md](./research.md)

**Questions?** Check constitution at `.specify/memory/constitution.md` for architectural guidelines.
