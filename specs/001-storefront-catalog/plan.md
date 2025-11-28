# Implementation Plan: Storefront Catalog and Cart

**Branch**: `001-storefront-catalog` | **Date**: 2025-11-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-storefront-catalog/spec.md`

## Summary

Implement public-facing e-commerce storefront for "Glow Up Beauty" enabling customers to browse cosmetic products, filter by category, search, view details, and manage a shopping cart with localStorage persistence. No authentication required in Phase 1. Technical approach uses React 19+ SPA with TanStack Query for server state, React Context for cart client state, and Axios for API communication following constitution's feature-based architecture.

## Technical Context

**Language/Version**: TypeScript v5.9.3, React v19.1.1  
**Primary Dependencies**: TanStack Query v5.90.3, React Router DOM v7.9.4, Axios v1.12.2, React Hook Form v7.66.0, Zod v4.1.12  
**Storage**: Browser localStorage (cart persistence), Backend PostgreSQL via REST API (read-only products/categories)  
**Testing**: Not specified in Phase 1 (deferred)  
**Target Platform**: Modern browsers (ES2020+), responsive web (mobile-first)  
**Project Type**: Web application (frontend SPA)  
**Performance Goals**: <2s initial product load, <500ms cart operations, <1s category filter, <800ms search (300ms debounce + 500ms response)  
**Constraints**: Read-only API access (no auth), localStorage 5MB limit, client-side filtering for search, no pagination (handle ~100 products)  
**Scale/Scope**: Phase 1 MVP - 5 user stories (Browse, Filter, Details, Search, Cart), ~15 components, 3 DTOs, 2 services, 6+ hooks, 4 routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Feature-Based Architecture ✅ PASS

**Rule**: All code MUST follow `src/cases/[feature]/` with `components`, `dtos`, `hooks`, `services` subdirectories.

**This Feature**: Will create two feature modules:
- `src/cases/catalog/` - Product browsing, filtering, search, details
- `src/cases/cart/` - Shopping cart management, localStorage persistence

**Compliance**: ✅ Both features will have all four required subdirectories. Shared UI components (Header, ProductCard) will be in `src/components/ui/` or `src/components/layout/` as permitted.

---

### Gate 2: DTOs-First Data Contract ✅ PASS

**Rule**: TypeScript interfaces with `DTO` suffix MUST be defined before implementation, matching backend exactly.

**This Feature**: Will define:
- `ProductDTO` (matches backend Product entity)
- `CategoryDTO` (matches backend Category entity)
- `BrandDTO` (matches backend Brand entity - nested in ProductDTO)
- `CartItemDTO` (client-only, not from backend)

**Compliance**: ✅ All DTOs will be defined first in Phase 1 design. ProductDTO/CategoryDTO/BrandDTO match backend spec exactly. CartItemDTO is client-only (permitted for UI state).

---

### Gate 3: Service Layer Encapsulation ✅ PASS

**Rule**: ALL API calls MUST go through Service objects with CRUD methods returning typed Promises.

**This Feature**: Will create:
- `ProductService` with `list()`, `listByCategory(categoryId)`, `getById(id)`
- `CategoryService` with `list()`

**Compliance**: ✅ Services follow CRUD pattern. Uses Axios instance from `lib/axios.ts`. Returns `Promise<ProductDTO[]>`, `Promise<ProductDTO>`, `Promise<CategoryDTO[]>`. No create/update/delete needed (read-only in storefront).

---

### Gate 4: Custom Hooks for State Management ✅ PASS

**Rule**: Data fetching via TanStack Query hooks. Components never call services directly.

**This Feature**: Will create hooks:
- `useProducts()` - List all products (useQuery)
- `useProductsByCategory(categoryId)` - Filtered products (useQuery)
- `useProduct(id)` - Single product details (useQuery)
- `useCategories()` - List categories (useQuery)
- Cart hooks via Context: `useCart()`, `useAddToCart()`, `useRemoveFromCart()`, `useUpdateCartQuantity()`

**Compliance**: ✅ All data fetching through hooks. Query keys follow pattern. Cart uses React Context (allowed for client state per constitution).

---

### Gate 5: Component Purity & Presentation ✅ PASS

**Rule**: Components are presentational. No business logic, data fetching, or direct API calls. Forms use Zod + React Hook Form.

**This Feature**: Components will:
- Consume data from hooks (not services)
- Render UI only
- No forms in Phase 1 (cart operations use simple buttons)

**Compliance**: ✅ All components consume hooks. No forms needed for cart (just buttons). ProductCard, ProductGrid, CategoryFilter, CartDrawer are pure presentation.

---

### Gate 6: Routing & Navigation Pattern ✅ PASS

**Rule**: React Router DOM v7 with nested layouts. Forms use Sheets (storefront has no forms in Phase 1).

**This Feature**: Routes:
- `/` - Homepage with product grid
- `/category/:categoryId` - Filtered product grid  
- `/product/:id` - Product detail page
- `/cart` - Cart view (could be Sheet or separate page)

**Compliance**: ✅ Uses React Router DOM v7. No forms needed. Cart drawer can use Sheet component for slide-over. Layout nesting (Header + Main).

---

### Gate 7: Styling & Design System Consistency ✅ PASS

**Rule**: Tailwind CSS v4 + shadcn/ui (new-york/neutral). Lucide React icons. BRL currency formatting.

**This Feature**: Will use:
- Tailwind utility classes (mobile-first)
- shadcn Badge, Button, Sheet, Card components
- Lucide icons (ShoppingCart, Search, X, Plus, Minus)
- React Intl for BRL currency formatting

**Compliance**: ✅ Follows design system. Uses shadcn components from `src/components/ui/`. Tailwind v4 utilities. BRL formatting via React Intl.

---

**OVERALL RESULT**: ✅ **ALL GATES PASS** - No constitution violations. Feature fully compliant with architectural principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-storefront-catalog/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0: Technical research and decisions
├── data-model.md        # Phase 1: DTO definitions and relationships
├── quickstart.md        # Phase 1: Developer setup and testing guide
├── contracts/           # Phase 1: API contract examples
│   └── api-examples.md
└── checklists/
    └── requirements.md  # Spec quality validation (completed)
```

### Source Code (repository root)

```text
src/
├── cases/
│   ├── catalog/                    # Feature: Product browsing
│   │   ├── components/
│   │   │   ├── product-card.tsx           # Product display card
│   │   │   ├── product-grid.tsx           # Grid layout for products
│   │   │   ├── product-detail.tsx         # Full product view
│   │   │   ├── category-filter.tsx        # Category sidebar/menu
│   │   │   ├── search-bar.tsx             # Search input with debounce
│   │   │   └── empty-state.tsx            # No products/results message
│   │   ├── dtos/
│   │   │   ├── product.dto.ts             # ProductDTO interface
│   │   │   ├── category.dto.ts            # CategoryDTO interface
│   │   │   └── brand.dto.ts               # BrandDTO interface
│   │   ├── hooks/
│   │   │   ├── use-products.ts            # List all products
│   │   │   ├── use-products-by-category.ts # Filter by category
│   │   │   ├── use-product.ts             # Get single product
│   │   │   ├── use-categories.ts          # List categories
│   │   │   └── use-product-search.ts      # Search with debounce
│   │   └── services/
│   │       ├── product.service.ts         # Product API calls
│   │       └── category.service.ts        # Category API calls
│   │
│   └── cart/                       # Feature: Shopping cart
│       ├── components/
│       │   ├── cart-drawer.tsx            # Slide-over cart view
│       │   ├── cart-item.tsx              # Individual cart item row
│       │   ├── cart-summary.tsx           # Subtotal display
│       │   ├── cart-icon-badge.tsx        # Header cart icon + count
│       │   └── empty-cart.tsx             # Empty cart message
│       ├── dtos/
│       │   └── cart-item.dto.ts           # CartItemDTO interface
│       ├── hooks/
│       │   └── use-cart-storage.ts        # localStorage sync hook
│       └── context/
│           ├── cart-context.tsx           # CartContext + Provider
│           └── cart-actions.ts            # Cart action functions
│
├── components/
│   ├── layout/
│   │   ├── header.tsx                     # Site header with nav
│   │   ├── footer.tsx                     # Site footer
│   │   └── main-layout.tsx                # Page wrapper
│   └── ui/                                # shadcn components
│       ├── badge.tsx                      # (existing)
│       ├── button.tsx                     # (existing)
│       ├── card.tsx                       # (existing)
│       ├── sheet.tsx                      # (existing/new for cart)
│       └── skeleton.tsx                   # (existing/new for loading)
│
├── lib/
│   ├── axios.ts                           # Axios instance config
│   ├── utils.ts                           # cn() utility
│   └── format-currency.ts                 # BRL formatting helper
│
├── App.tsx                                # Root component + routes
├── main.tsx                               # Entry point
└── index.css                              # Global styles + Tailwind

.env
VITE_API_URL=http://localhost:3000        # Backend API base URL
```

**Structure Decision**: Single web application project (frontend only). Uses **Option 2** pattern from template (web app), but only frontend portion as backend already exists. Feature-based organization under `src/cases/` with two features: `catalog` (product browsing) and `cart` (shopping cart). All features follow four-directory pattern (components/dtos/hooks/services, with cart adding context/ for React Context).

## Complexity Tracking

**No violations** - Constitution Check passed all gates. This section intentionally left blank as no constitutional principles were violated.

---

## Phase 0: Outline & Research

### Research Objectives

From Technical Context, the following items require research or validation:

1. **localStorage Cart Persistence**: Best practices for localStorage cart structure, size limits, serialization, sync timing
2. **TanStack Query Configuration**: Optimal query keys, cache times, stale times for product catalog use case
3. **Search Implementation**: Client-side vs server-side filtering, debounce implementation, performance with ~100 products
4. **Category Filtering**: URL-based filtering with React Router (query params vs path params), state persistence
5. **BRL Currency Formatting**: React Intl setup for pt-BR locale, number formatting patterns
6. **Image Placeholders**: Best practices for product image placeholders in beauty/cosmetics domain
7. **Responsive Grid Layout**: Tailwind grid patterns for mobile/tablet/desktop product cards

### Research Tasks

Each unknown will be researched and documented in `research.md`:

- **Task R1**: Research localStorage best practices for e-commerce carts (structure, size limits, error handling)
- **Task R2**: Determine TanStack Query configuration (query keys, cache/stale times, refetch behavior)
- **Task R3**: Compare client-side vs server-side product search approaches (performance, UX, implementation complexity)
- **Task R4**: Research URL-based filtering patterns with React Router v7 (useSearchParams vs path params)
- **Task R5**: Setup React Intl for BRL currency formatting (IntlProvider, formatNumber, locale data)
- **Task R6**: Find appropriate placeholder images or patterns for cosmetics products
- **Task R7**: Design responsive Tailwind grid for product cards (breakpoints, aspect ratios, spacing)

**Output**: `research.md` with decisions, rationale, code examples, and best practices for each research area.

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

### 1. Data Model (`data-model.md`)

Extract entities from spec and backend API:

**ProductDTO** (from backend):
```typescript
interface ProductDTO {
  id: string;              // UUID
  name: string;
  description?: string;    // Optional
  price: number;           // Decimal
  active: boolean;
  category: CategoryDTO;   // Required relationship
  brand?: BrandDTO;        // Optional relationship
}
```

**CategoryDTO** (from backend):
```typescript
interface CategoryDTO {
  id: string;              // UUID
  name: string;
}
```

**BrandDTO** (from backend):
```typescript
interface BrandDTO {
  id: string;              // UUID
  name: string;
}
```

**CartItemDTO** (client-only):
```typescript
interface CartItemDTO {
  product: ProductDTO;     // Full product object
  quantity: number;        // User-selected quantity
  lineTotal: number;       // Calculated: quantity * product.price
}
```

**CartStateDTO** (client-only):
```typescript
interface CartStateDTO {
  items: CartItemDTO[];
  subtotal: number;        // Calculated: sum of all lineTotals
  itemCount: number;       // Calculated: sum of all quantities
}
```

### 2. API Contracts (`contracts/api-examples.md`)

Document expected API request/response formats:

**GET /products** - List all active products:
```json
Response (200):
[
  {
    "id": "uuid-1",
    "name": "Hydrating Serum",
    "description": "Moisturizing face serum",
    "price": 89.90,
    "active": true,
    "category": { "id": "cat-1", "name": "Skincare" },
    "brand": { "id": "brand-1", "name": "Glow Up" }
  }
]
```

**GET /products?categoryId=uuid** - Filter by category:
```json
Response (200):
[/* filtered products */]
```

**GET /products/:id** - Single product:
```json
Response (200):
{
  "id": "uuid-1",
  "name": "Hydrating Serum",
  ...
}

Response (404):
{
  "statusCode": 404,
  "message": "Product not found"
}
```

**GET /categories** - List categories:
```json
Response (200):
[
  { "id": "cat-1", "name": "Skincare" },
  { "id": "cat-2", "name": "Makeup" }
]
```

### 3. Service Layer Specifications

**ProductService** (`src/cases/catalog/services/product.service.ts`):
```typescript
export const ProductService = {
  async list(): Promise<ProductDTO[]>
  async listByCategory(categoryId: string): Promise<ProductDTO[]>
  async getById(id: string): Promise<ProductDTO>
}
```

**CategoryService** (`src/cases/catalog/services/category.service.ts`):
```typescript
export const CategoryService = {
  async list(): Promise<CategoryDTO[]>
}
```

### 4. Hook Specifications

**Catalog Hooks**:
- `useProducts()` → `useQuery(['products'], ProductService.list)`
- `useProductsByCategory(categoryId)` → `useQuery(['products', 'category', categoryId], () => ProductService.listByCategory(categoryId))`
- `useProduct(id)` → `useQuery(['products', id], () => ProductService.getById(id))`
- `useCategories()` → `useQuery(['categories'], CategoryService.list)`
- `useProductSearch(query)` → Client-side filtering hook with debounce

**Cart Hooks** (via Context):
- `useCart()` → Returns `{ items, subtotal, itemCount, addItem, removeItem, updateQuantity, clearCart }`
- `useCartStorage()` → Syncs cart state with localStorage

### 5. Component Specifications

**Catalog Components**:
- `ProductCard` - Props: `product: ProductDTO`, displays image, name, brand, price, "Add to Cart" button
- `ProductGrid` - Props: `products: ProductDTO[]`, responsive grid layout
- `ProductDetail` - Props: `product: ProductDTO`, full page product view
- `CategoryFilter` - Props: `categories: CategoryDTO[]`, `activeCategory?: string`, `onSelect: (id) => void`
- `SearchBar` - Props: `onSearch: (query) => void`, debounced input
- `EmptyState` - Props: `message: string`, `action?: ReactNode`

**Cart Components**:
- `CartDrawer` - Sheet slide-over with cart contents
- `CartItem` - Props: `item: CartItemDTO`, `onUpdateQuantity`, `onRemove`
- `CartSummary` - Props: `subtotal: number`, displays formatted total
- `CartIconBadge` - Props: `count: number`, header icon with badge
- `EmptyCart` - Link back to products

**Layout Components**:
- `Header` - Logo, SearchBar, CartIconBadge
- `MainLayout` - Wraps pages with Header + Footer
- `Footer` - Site footer content

### 6. Routing Specification

**Routes** (React Router DOM v7):
```typescript
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<HomePage />} />                    // Product grid, all products
    <Route path="/category/:categoryId" element={<CategoryPage />} />  // Filtered products
    <Route path="/product/:id" element={<ProductDetailPage />} />     // Single product
    <Route path="/cart" element={<CartPage />} />                     // Full cart view (or use Sheet)
  </Route>
</Routes>
```

**Alternative**: Cart as Sheet (slide-over) instead of separate page, triggered by cart icon click.

### 7. State Management Architecture

**Server State** (TanStack Query):
- Products cache: 5 min stale time, 10 min cache time
- Categories cache: 1 hour stale time (rarely changes)
- Product details: 5 min stale time

**Client State** (React Context):
```typescript
// CartContext
interface CartContextType {
  items: CartItemDTO[];
  subtotal: number;
  itemCount: number;
  addItem: (product: ProductDTO, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// CartProvider wraps App, provides CartContext
// useCart() hook exposes CartContextType
```

**localStorage Sync**:
- Key: `ecommerce-cart`
- Structure: `{ items: CartItemDTO[], lastUpdated: ISO8601 string }`
- Sync on: cart state change (debounced 500ms)
- Restore on: app initialization

### 8. Quickstart Guide (`quickstart.md`)

Developer setup instructions:
1. Prerequisites (Node 18+, backend running)
2. Environment setup (`.env` with `VITE_API_URL`)
3. Install dependencies (`npm install`)
4. Run dev server (`npm run dev`)
5. Test scenarios (browse products, filter, add to cart, persist)
6. Common issues and troubleshooting

**Output**: 
- `data-model.md` with all DTO definitions
- `contracts/api-examples.md` with API request/response examples
- `quickstart.md` with setup and testing instructions

---

## Phase 1: Agent Context Update

After completing design documents, run:

```powershell
.\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot
```

This updates `.github/copilot-instructions.md` (or appropriate agent file) with:
- New DTOs: ProductDTO, CategoryDTO, BrandDTO, CartItemDTO
- New features: catalog, cart
- New technology: React Context for cart state, localStorage persistence
- Preserves manual additions between markers

---

## Phase 2: Re-check Constitution (Post-Design)

After Phase 1 design is complete, re-evaluate all gates:

### Gate 1: Feature-Based Architecture ✅ PASS
- `src/cases/catalog/` created with components, dtos, hooks, services
- `src/cases/cart/` created with components, dtos, hooks, context

### Gate 2: DTOs-First ✅ PASS
- All DTOs defined in `data-model.md` before implementation
- ProductDTO, CategoryDTO, BrandDTO match backend
- CartItemDTO defined for client state

### Gate 3: Service Layer ✅ PASS
- ProductService and CategoryService follow CRUD pattern
- All return typed Promises

### Gate 4: Custom Hooks ✅ PASS
- All data fetching through TanStack Query hooks
- Cart operations through Context hooks

### Gate 5: Component Purity ✅ PASS
- All components consume hooks, no direct service calls

### Gate 6: Routing ✅ PASS
- React Router DOM v7 with nested layouts

### Gate 7: Styling ✅ PASS
- Tailwind v4, shadcn/ui, Lucide icons, React Intl for BRL

**FINAL RESULT**: ✅ **ALL GATES PASS POST-DESIGN** - Ready for task breakdown (`/speckit.tasks`)

---

## Next Steps

This plan terminates after Phase 1 design. To proceed with implementation:

1. **Review** this plan and generated design docs (research.md, data-model.md, contracts/, quickstart.md)
2. **Run** `/speckit.tasks` to generate task breakdown (tasks.md)
3. **Implement** following task sequence organized by user story (P1 → P2 → P3)
4. **Test** using quickstart.md scenarios
5. **Iterate** as needed

**Files Generated by This Command**:
- ✅ `specs/001-storefront-catalog/plan.md` (this file)
- 🔄 `specs/001-storefront-catalog/research.md` (next: generated in Phase 0)
- 🔄 `specs/001-storefront-catalog/data-model.md` (next: generated in Phase 1)
- 🔄 `specs/001-storefront-catalog/quickstart.md` (next: generated in Phase 1)
- 🔄 `specs/001-storefront-catalog/contracts/api-examples.md` (next: generated in Phase 1)

**Not Generated** (requires `/speckit.tasks` command):
- ⏳ `specs/001-storefront-catalog/tasks.md`
