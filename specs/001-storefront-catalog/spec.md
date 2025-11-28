# Feature Specification: Storefront Catalog and Cart

**Feature Branch**: `001-storefront-catalog`  
**Created**: 2025-11-22  
**Status**: Draft  
**Input**: User description: "Storefront Catalog and Cart - Phase 1: Public catalog navigation, product browsing, search, and client-side cart management with localStorage persistence"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Product Catalog (Priority: P1)

A customer visits the "Glow Up Beauty" storefront to explore available cosmetic products. They can view all active products in a grid layout with essential information (name, brand, price, image) to make informed purchasing decisions.

**Why this priority**: This is the foundational capability of an e-commerce storefront. Without the ability to view products, no other features (cart, checkout, etc.) have value. This delivers immediate value by allowing customers to discover products.

**Independent Test**: Can be fully tested by navigating to the homepage and verifying that all active products from the API are displayed with proper formatting, images (or placeholders), and prices in BRL currency.

**Acceptance Scenarios**:

1. **Given** I am on the homepage, **When** the page loads, **Then** I see a grid of all active products with their name, brand, price (formatted in BRL), and image (or placeholder)
2. **Given** products are displayed, **When** I scroll through the catalog, **Then** the layout remains responsive on mobile, tablet, and desktop viewports
3. **Given** a product has no image, **When** it is displayed, **Then** I see a professional placeholder image maintaining the design aesthetic
4. **Given** there are no active products in the system, **When** I visit the homepage, **Then** I see a friendly "No products available" message

---

### User Story 2 - Filter by Category (Priority: P2)

A customer wants to narrow their product search by browsing specific categories (e.g., "Skincare", "Makeup", "Haircare"). They can use a sidebar menu or filter to view only products in their category of interest.

**Why this priority**: Filtering by category significantly improves user experience for focused shopping but isn't required for the basic browsing flow. It's a natural second step after establishing the core product display.

**Independent Test**: Can be fully tested by clicking on a category filter and verifying that only products belonging to that category are displayed, with the ability to clear the filter and return to all products.

**Acceptance Scenarios**:

1. **Given** I am on the homepage, **When** I view the category menu, **Then** I see all available categories from the API
2. **Given** categories are displayed, **When** I click on a specific category, **Then** the product grid updates to show only products from that category
3. **Given** a category filter is active, **When** I click "All Products" or clear the filter, **Then** I see the full product catalog again
4. **Given** a category has no active products, **When** I select it, **Then** I see a message indicating no products are available in this category
5. **Given** I have filtered by category, **When** I refresh the page, **Then** the selected category filter persists (URL-based filtering)

---

### User Story 3 - View Product Details (Priority: P2)

A customer wants detailed information about a specific product before adding it to their cart. They can click on a product to view its full description, brand, price, and larger image.

**Why this priority**: Product detail pages provide crucial information for purchase decisions. While browsing is P1, detailed views enhance conversion but aren't blocking for the MVP cart functionality.

**Independent Test**: Can be fully tested by clicking on any product card and verifying that the detail page displays complete product information including description, with a "Back" or "Add to Cart" action.

**Acceptance Scenarios**:

1. **Given** I am viewing the product catalog, **When** I click on a product card, **Then** I navigate to `/product/:id` showing full product details
2. **Given** I am on a product detail page, **When** the page loads, **Then** I see the product name, description, price (BRL), brand, and image
3. **Given** I am viewing product details, **When** I want to return to browsing, **Then** I can click a "Back to Products" link or use browser back navigation
4. **Given** I navigate to a product detail page with an invalid ID, **When** the API returns 404, **Then** I see a "Product not found" error message
5. **Given** a product has no description, **When** I view its details, **Then** the description section is omitted or shows appropriate messaging

---

### User Story 4 - Search Products (Priority: P3)

A customer knows what they're looking for and wants to quickly find products by typing in a search box. The search filters products by name or description in real-time with debounced input.

**Why this priority**: Search improves findability but is less critical than browsing and filtering for Phase 1. Customers can still discover products through browsing and category filtering.

**Independent Test**: Can be fully tested by typing into the search input and verifying that the product list dynamically filters to match entries, with debouncing preventing excessive API calls or re-renders.

**Acceptance Scenarios**:

1. **Given** I am on the homepage, **When** I type in the search input, **Then** the product list filters to show only products matching my search term (name or description)
2. **Given** I am typing a search query, **When** I pause typing for 300ms, **Then** the filter is applied (debounced to avoid performance issues)
3. **Given** no products match my search, **When** I finish typing, **Then** I see a "No products found" message
4. **Given** I have entered a search term, **When** I clear the input, **Then** all products are displayed again
5. **Given** I search for products, **When** the search is active, **Then** category filters still work in combination with the search term

---

### User Story 5 - Manage Shopping Cart (Priority: P1)

A customer wants to add products to a shopping cart for later checkout. They can add items, remove items, change quantities, view the cart, and see the running subtotal. The cart persists across browser sessions using localStorage.

**Why this priority**: Cart functionality is essential for e-commerce. It's rated P1 alongside browsing because it's the minimum required for a functional shopping experience, even without checkout integration.

**Independent Test**: Can be fully tested by adding products to the cart, verifying persistence after page refresh, adjusting quantities, removing items, and confirming the subtotal updates correctly—all without requiring backend integration.

**Acceptance Scenarios**:

1. **Given** I am viewing a product, **When** I click "Add to Cart", **Then** the product is added to my cart with quantity 1 and I see a confirmation (toast or visual feedback)
2. **Given** I have items in my cart, **When** I click the cart icon in the header, **Then** I see a list of all cart items with product name, quantity, unit price, and line total
3. **Given** I am viewing my cart, **When** I change the quantity of an item, **Then** the line total and cart subtotal update immediately
4. **Given** I am viewing my cart, **When** I click "Remove" on an item, **Then** that item is removed and the subtotal recalculates
5. **Given** I have items in my cart, **When** I refresh the page or close and reopen the browser, **Then** my cart items persist (via localStorage)
6. **Given** I have an empty cart, **When** I view the cart, **Then** I see an "Your cart is empty" message with a link back to products
7. **Given** the cart icon in the header, **When** I have items in my cart, **Then** I see a badge showing the total item count
8. **Given** I add the same product twice, **When** it's already in the cart, **Then** the quantity increments rather than creating a duplicate entry

---

### Edge Cases

- What happens when the API is unavailable or returns an error (products fail to load)?
- How does the system handle products with extremely long names or descriptions (text overflow)?
- What happens if a user tries to add 0 or negative quantity to the cart?
- How does the cart behave if localStorage is full or disabled by the user's browser?
- What happens if the product data changes (price update, product deactivated) while it's in the user's cart?
- How does the search handle special characters or very long search strings?
- What happens when a product is deleted from the backend but still exists in a user's cart (stale data)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all active products retrieved from `GET /products` API endpoint
- **FR-002**: System MUST format product prices in Brazilian Real (BRL) using appropriate currency formatting (R$ with decimal separator)
- **FR-003**: System MUST display a placeholder image when a product has no associated image URL
- **FR-004**: System MUST provide a responsive layout that adapts to mobile, tablet, and desktop screen sizes (mobile-first approach)
- **FR-005**: System MUST retrieve and display all categories from `GET /categories` API endpoint in a navigation or filter menu
- **FR-006**: System MUST filter products by category when a user selects a category using `GET /products?categoryId=[uuid]` endpoint
- **FR-007**: System MUST display individual product details when navigating to `/product/:id` route using `GET /products/:id` endpoint
- **FR-008**: System MUST provide a search input that filters products by name or description
- **FR-009**: System MUST debounce search input by at least 300ms to prevent excessive filtering operations
- **FR-010**: System MUST implement a shopping cart using React Context API (`CartContext` and `CartProvider`)
- **FR-011**: System MUST allow users to add products to the cart with default quantity of 1
- **FR-012**: System MUST allow users to increase or decrease item quantities in the cart
- **FR-013**: System MUST allow users to remove items from the cart
- **FR-014**: System MUST calculate and display cart subtotal by summing (quantity × unit price) for all items
- **FR-015**: System MUST persist cart data to browser localStorage under the key `ecommerce-cart`
- **FR-016**: System MUST restore cart data from localStorage when the application initializes
- **FR-017**: System MUST display a cart icon in the header with a badge showing total item count
- **FR-018**: System MUST prevent duplicate cart entries for the same product (increment quantity instead)
- **FR-019**: System MUST use Axios HTTP client configured with `VITE_API_URL` base URL from environment variables
- **FR-020**: System MUST use TanStack Query v5 for data fetching with automatic caching and refetching
- **FR-021**: System MUST provide visual feedback (toast notification or inline message) when products are added to cart
- **FR-022**: System MUST display loading states while fetching products or product details from the API
- **FR-023**: System MUST display error messages when API calls fail (network error, 404, 500, etc.)
- **FR-024**: System MUST use strict TypeScript typing with ProductDTO and CategoryDTO interfaces matching backend entities

### Key Entities

- **Product**: Represents a cosmetic product available for purchase; attributes include id (UUID), name, description (optional), price (decimal), active status (boolean), associated category (CategoryDTO), and optional brand (BrandDTO)
- **Category**: Represents a product classification; attributes include id (UUID) and name
- **Brand**: Represents a product manufacturer or brand; attributes include id (UUID) and name
- **CartItem**: Client-side only entity representing a product in the shopping cart; attributes include product (ProductDTO), quantity (number), and calculated line total
- **Cart**: Client-side only aggregate containing an array of CartItems and calculated subtotal

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all active products within 2 seconds of page load (initial rendering with loading state)
- **SC-002**: Users can successfully add products to cart and see confirmation feedback in under 500ms (optimistic UI update)
- **SC-003**: Cart data persists across browser sessions—users closing and reopening the browser see their cart intact
- **SC-004**: Product filtering by category updates the display within 1 second of selection
- **SC-005**: Search results appear within 500ms after debounce period completes (total 800ms from last keystroke)
- **SC-006**: 100% of cart operations (add, remove, update quantity) complete without page refresh (SPA behavior)
- **SC-007**: Mobile users can browse products and manage cart with the same functionality as desktop users (responsive design parity)
- **SC-008**: Users can browse at least 100 products without performance degradation (rendering, scrolling smoothness)
- **SC-009**: Cart subtotal calculation accuracy is 100% (no rounding errors, matches sum of line totals)
- **SC-010**: Empty states (no products, no search results, empty cart) display helpful messaging and recovery actions

## Assumptions

- **A-001**: The backend API (`VITE_API_URL`) is accessible and returns data in the format specified in the backend technical specifications
- **A-002**: All products returned by `GET /products` with `active: true` are suitable for public display
- **A-003**: Product prices are provided in Brazilian Real (BRL) and do not require currency conversion
- **A-004**: Product images, when available, are URLs pointing to accessible image resources (or placeholders are acceptable)
- **A-005**: Browser localStorage is available and has at least 5MB capacity for cart data
- **A-006**: Authentication is NOT required for Phase 1—all catalog browsing and cart management is anonymous
- **A-007**: Checkout functionality is out of scope for Phase 1; cart is the terminal state in this phase
- **A-008**: The storefront will use the same Tailwind CSS and shadcn/ui configuration as the CMS (neutral theme, new-york style)
- **A-009**: Categories are relatively stable; dynamic category updates do not require real-time synchronization
- **A-010**: The feature will be implemented in a separate feature folder (`src/cases/storefront/`) following the constitution's feature-based architecture

## Scope Boundaries

### In Scope
- Public catalog browsing (all active products)
- Category-based filtering
- Product detail pages
- Search functionality (client-side or via API)
- Shopping cart (add, remove, update quantity, view, persist)
- Responsive design (mobile-first)
- Integration with existing backend API endpoints (read-only)

### Out of Scope
- User authentication and login (deferred to later phase)
- Checkout process and order creation
- Payment processing
- User accounts and order history
- Product reviews or ratings
- Product recommendations or "related products"
- Admin functionality (product management is in the CMS)
- Inventory management or stock levels
- Shipping calculation
- Wishlist or favorites
- Product image galleries (single image per product only)
- Social sharing features
- Multi-language support (Portuguese BRL only)

## Dependencies

- **Backend API**: Requires NestJS backend to be running and accessible at `VITE_API_URL` with the following endpoints operational:
  - `GET /products`
  - `GET /products?categoryId=[uuid]`
  - `GET /products/:id`
  - `GET /categories`
- **Constitution Compliance**: Must adhere to architectural patterns defined in `.specify/memory/constitution.md`:
  - Feature-based structure in `src/cases/storefront/`
  - DTOs-first approach (ProductDTO, CategoryDTO, BrandDTO)
  - Service layer for API calls (ProductService, CategoryService)
  - Custom hooks with TanStack Query (useProducts, useProduct, useCategories)
  - React Context for cart management (CartContext, CartProvider)
  - Tailwind CSS v4 and shadcn/ui components
- **Shared Components**: May reuse UI components from `src/components/ui/` (shadcn) and `src/components/layout/` where applicable
- **Environment Configuration**: Requires `VITE_API_URL` to be set in `.env` file

## Technical Constraints

- **Frontend Framework**: React v19+, TypeScript v5.9+, Vite
- **State Management**: TanStack Query v5 for server state, React Context for cart client state
- **HTTP Client**: Axios configured with baseURL from environment
- **Styling**: Tailwind CSS v4, shadcn/ui (new-york/neutral), Lucide React icons
- **Browser Support**: Modern browsers supporting ES2020+ and localStorage API
- **Performance**: Must handle at least 100 products without pagination in Phase 1 (pagination may be added later if needed)
- **TypeScript**: Strict mode enabled, no `any` types, all DTOs explicitly typed
