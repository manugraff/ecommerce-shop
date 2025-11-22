<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version Change: INITIAL → 1.0.0 (New Constitution)
Modified Principles: N/A (Initial creation)
Added Sections: All sections (Initial document)
Removed Sections: None

Templates Impact:
✅ plan-template.md - Aligned (constitution checks will reference these principles)
✅ spec-template.md - Aligned (user stories align with data model requirements)
✅ tasks-template.md - Aligned (feature-based organization matches)

Follow-up TODOs:
- None (All principles defined and validated)

Rationale for Version 1.0.0:
- Initial constitution establishing project governance
- All principles defined with concrete, testable rules
- Complete tech stack and architectural patterns documented
-->

# Ecommerce CMS & Storefront Constitution

## Core Principles

### I. Feature-Based Architecture (NON-NEGOTIABLE)

**Law**: All code MUST follow the feature-based structure pattern: `src/cases/[feature]/` containing exactly four subdirectories: `components`, `dtos`, `hooks`, and `services`.

**Rationale**: This structure enforces separation of concerns and makes code predictable and navigable. Every feature is self-contained with its data contracts (DTOs), UI components, business logic (hooks), and API communication (services) in one place.

**Rules**:
- NO feature code outside `src/cases/[feature]/` directories
- MUST have all four subdirectories even if some are initially empty
- Features: `brands`, `categories`, `products`, `customers`, `orders` (CMS)
- Shared components belong in `src/components/layout/` or `src/components/ui/` ONLY

### II. DTOs-First Data Contract (NON-NEGOTIABLE)

**Law**: Every data entity MUST be defined as a TypeScript interface with the `DTO` suffix before ANY implementation code is written. DTO definitions MUST exactly match the backend entity structure.

**Rationale**: DTOs serve as the single source of truth for data shape. Frontend-backend contract violations are caught at compile time, not runtime.

**Rules**:
- Interface name: `[Entity]DTO` (e.g., `ProductDTO`, `OrderDTO`)
- Location: `src/cases/[feature]/dtos/[entity].dto.ts`
- NO `any` types allowed - all properties must be explicitly typed
- Nested entities MUST reference their DTOs (e.g., `category: CategoryDTO`)
- Optional vs required MUST match backend exactly (use `?` for optional)
- Order status MUST use exact enum: NEW, SEPARATION, INVOICED, SHIPPED, DELIVERED, CANCELED

### III. Service Layer Encapsulation (NON-NEGOTIABLE)

**Law**: ALL API communication MUST be encapsulated in Service objects following the CRUD pattern. Services MUST use the configured Axios instance and return properly typed DTOs.

**Rationale**: Centralizes HTTP logic, provides type safety, enables consistent error handling and request/response transformation.

**Rules**:
- Service name: `[Entity]Service` exported as const object
- Location: `src/cases/[feature]/services/[entity].service.ts`
- MUST implement all CRUD operations: `list()`, `create()`, `getById()`, `update()`, `delete()`
- Return types MUST be `Promise<DTO>` or `Promise<DTO[]>` or `Promise<void>`
- MUST use `api` instance from `lib/axios.ts` configured with `VITE_API_URL`
- Error handling: Let Axios interceptors handle errors, do NOT catch in service methods

### IV. Custom Hooks for State Management (NON-NEGOTIABLE)

**Law**: Data fetching and mutations MUST be wrapped in custom hooks using TanStack Query v5. Components MUST NOT directly call service methods.

**Rationale**: Hooks provide automatic caching, refetching, loading states, and error handling. Keeps components pure and presentational.

**Rules**:
- Hook naming: `use[Entity]()`, `use[Entity]s()`, `useCreate[Entity]()`, `useUpdate[Entity]()`, `useDelete[Entity]()`
- Location: `src/cases/[feature]/hooks/use-[entity].ts`
- MUST use `useQuery` for reads, `useMutation` for writes
- Query keys format: `['[entity]']` for list, `['[entity]', id]` for single item
- MUST invalidate queries on successful mutations using `queryClient.invalidateQueries`
- Loading/error states exposed via destructured `isLoading`, `error` properties

### V. Component Purity & Presentation (NON-NEGOTIABLE)

**Law**: React components MUST be presentational only. Business logic, data fetching, and side effects belong in hooks. Form validation MUST use Zod + React Hook Form.

**Rationale**: Pure components are testable, reusable, and maintainable. Validation schemas provide type safety and user feedback.

**Rules**:
- Component files: PascalCase names ending in `.tsx` (e.g., `ProductForm.tsx`, `ProductLayout.tsx`)
- Location: `src/cases/[feature]/components/[component-name].tsx`
- NO direct `fetch()` or `axios` calls in components
- NO business logic beyond UI state (e.g., form field visibility)
- Forms MUST define Zod schema and use `zodResolver` with `useForm`
- Form schemas MUST validate ALL DTO fields including nested relationships
- Data tables MUST use TanStack Table v8 with `ColumnDef` type definitions

### VI. Routing & Navigation Pattern

**Law**: React Router DOM v7 MUST be used with layout nesting. Forms MUST open in Sheet components (slide-over), NOT separate pages. Navigation structure: Sidebar + Main Area + Sheet.

**Rationale**: Sheets keep context visible and reduce navigation complexity. Nested routes maintain clean URLs while sharing layout components.

**Rules**:
- Base routes: `/categories`, `/brands`, `/products`, `/customers`, `/orders`
- Create route: `/[resource]/new` → Opens Sheet with empty form
- Edit route: `/[resource]/:id` → Opens Sheet with populated form
- Sheet MUST close and navigate to base route on save/cancel
- Breadcrumbs MUST reflect current route using `BreadCrumb` component
- Sidebar navigation MUST use the `AppSidebar` component from `src/components/layout/`

### VII. Styling & Design System Consistency

**Law**: MUST use Tailwind CSS v4 utility classes and shadcn/ui components configured with "new-york" style and "neutral" base color. Custom components MUST extend shadcn patterns.

**Rationale**: Consistent design language, accessibility built-in, utility-first styling reduces CSS bloat.

**Rules**:
- shadcn components location: `src/components/ui/` (DO NOT modify)
- Icons: MUST use Lucide React library exclusively
- Class merging: MUST use `cn()` utility from `lib/utils.ts`
- Theme colors: MUST use CSS variables defined in `index.css`
- Status badges: MUST use predefined colors (Blue: NEW, Amber: SEPARATION, Violet: INVOICED, Cyan: SHIPPED, Green: DELIVERED, Red: CANCELED)
- Currency formatting: MUST use React Intl with BRL locale

## Tech Stack Mandate (Immutable)

### Frontend Stack

**Core Framework**:
- React v19.1.1 (MINIMUM version, MUST NOT downgrade)
- TypeScript v5.9.3 (MINIMUM version, strict mode enabled)
- Vite (build tool, MUST use `import.meta.env` for environment variables)

**State & Data Management**:
- TanStack Query v5.90.3 for server state (queries, mutations, cache)
- React Context API for client state (Cart in Storefront ONLY)
- Axios v1.12.2 for HTTP client (configured in `lib/axios.ts`)

**Forms & Validation**:
- React Hook Form v7.66.0 (form state management)
- Zod v4.1.12 (schema validation and TypeScript inference)

**UI Libraries**:
- Tailwind CSS v4.1.15 (utility-first styling)
- Radix UI (accessible headless components: Dialog, Select, Switch, Tabs, Tooltip)
- shadcn/ui components (new-york style, neutral base)
- Lucide React v0.546.0 (icon library)
- React Toastify v11.0.5 OR Sonner (toast notifications)

**Routing**:
- React Router DOM v7.9.4 (client-side routing, nested routes)

**Internationalization**:
- React Intl v7.1.14 (number/currency formatting, localization)

### Backend API Contract

**Framework**: NestJS v11+ (TypeScript, RESTful API)
**Database**: PostgreSQL with TypeORM
**Base URL**: Configured via `VITE_API_URL` environment variable
**CORS**: Enabled for frontend origin
**API Convention**: RESTful CRUD endpoints (`GET /[resource]`, `POST /[resource]`, `PUT /[resource]/:id`, `DELETE /[resource]/:id`)

### Development Tools

- ESLint v9.36.0 with TypeScript ESLint rules
- Prettier (code formatting, MUST be configured)
- Node.js v18+ (MINIMUM version)

## Data Model & API Contract (Absolute Truth)

### Entities & Relationships

**Category** (Independent):
```typescript
interface CategoryDTO {
  id?: string;           // UUID, auto-generated
  name: string;          // Max 60 chars, required
}
```

**Brand** (Independent):
```typescript
interface BrandDTO {
  id?: string;           // UUID, auto-generated
  name: string;          // Max 60 chars, required
}
```

**Product** (Depends on Category, optional Brand):
```typescript
interface ProductDTO {
  id?: string;
  name: string;          // Required
  description?: string;  // Optional, TEXT type
  price: number;         // Required, decimal (10,2)
  active: boolean;       // Default: true
  category: CategoryDTO; // REQUIRED relationship (eager loaded)
  brand?: BrandDTO;      // OPTIONAL relationship (eager loaded)
}
```

**State** (Independent):
```typescript
interface StateDTO {
  id?: string;
  name: string;          // Max 60 chars
  ibge: string;          // 2 chars, required
  acronym: string;       // 2 chars, required (UF)
}
```

**City** (Depends on State):
```typescript
interface CityDTO {
  id?: string;
  name: string;          // Max 60 chars
  ibge: string;          // 7 chars, required
  state: StateDTO;       // REQUIRED relationship (eager loaded)
}
```

**Customer** (Optional City):
```typescript
interface CustomerDTO {
  id?: string;
  name: string;          // Required
  address?: string;      // Max 250 chars, optional
  zipcode?: string;      // 8 chars (no hyphen), optional
  city?: CityDTO;        // OPTIONAL relationship (eager loaded)
}
```

**Order** (Depends on Customer, has OrderItems):
```typescript
interface OrderDTO {
  id?: string;
  customer: CustomerDTO; // REQUIRED relationship (eager loaded)
  shipping?: number;     // Decimal (10,2), optional
  status: string;        // ENUM: NEW | SEPARATION | INVOICED | SHIPPED | DELIVERED | CANCELED
  total?: number;        // Decimal (10,2), optional
  items: OrderItemDTO[]; // REQUIRED, min 1 item (eager loaded, cascade)
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-updated
}
```

**OrderItem** (Depends on Product):
```typescript
interface OrderItemDTO {
  id?: string;
  product: ProductDTO;   // REQUIRED relationship (eager loaded)
  quantity: number;      // Decimal (10,2), required
  value: number;         // Decimal (10,2), required (unit price)
}
```

### API Endpoint Patterns

**Standard CRUD for all resources**:
- `GET /[resource]` → List all (optionally filtered by query params)
- `POST /[resource]` → Create new (body: DTO without id)
- `GET /[resource]/:id` → Get by ID (returns 404 if not found)
- `PUT /[resource]/:id` → Update existing (body: full DTO)
- `DELETE /[resource]/:id` → Delete (returns 204 on success)

**Filtering**:
- `GET /products?categoryId=[uuid]` → Filter products by category
- `GET /orders?customerId=[uuid]` → Filter orders by customer

**Status Codes**:
- 200 OK (successful GET/PUT)
- 201 Created (successful POST)
- 204 No Content (successful DELETE)
- 400 Bad Request (validation error)
- 404 Not Found (resource not found)
- 422 Unprocessable Entity (entity validation error)
- 500 Internal Server Error

## Coding Standards & Conventions (Absolute)

### File Naming

- **Components**: PascalCase with `.tsx` extension (`ProductForm.tsx`, `DataTable.tsx`)
- **Hooks**: camelCase with `use` prefix and `.ts` extension (`use-products.ts`, `use-create-product.ts`)
- **Services**: camelCase with `.service.ts` suffix (`product.service.ts`)
- **DTOs**: camelCase with `.dto.ts` suffix (`product.dto.ts`)
- **Utilities**: kebab-case with `.ts` extension (`format-currency.ts`)

### Import Conventions

- MUST use absolute imports with `@/` alias (configured in `tsconfig.json` and `vite.config.ts`)
- Group imports: React → Third-party → Local components → Local hooks → Local services → Local DTOs
- Named exports preferred over default exports (except for React components)

### Naming Conventions

- **Interfaces/Types**: PascalCase with `DTO` suffix for data contracts
- **Components**: PascalCase (matches filename)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects
- **Hooks**: camelCase starting with `use`

### TypeScript Rules

- NO `any` type (use `unknown` if truly dynamic, then type-guard)
- Use `interface` for object shapes, `type` for unions/intersections
- Enable strict mode in `tsconfig.json`
- Explicitly type function return values for public APIs
- Use `satisfies` operator for validation while preserving inference

## Workflow & Development Rules

### Form Development Flow

1. Define Zod schema using DTO as reference
2. Create form component using React Hook Form + `zodResolver`
3. Implement submit handler that transforms form values to DTO
4. Call mutation hook (e.g., `useCreateProduct()`)
5. Handle success: show toast, invalidate queries, close sheet, navigate
6. Handle error: display field-specific errors from Zod validation

### User Feedback Requirements

- MUST show toast notification on successful create/update/delete
- MUST show toast notification on API errors
- MUST display loading spinner during mutations (use `isLoading` from mutation hook)
- MUST display skeleton loaders during initial query loading
- MUST disable submit button during form submission
- MUST show field-level validation errors inline (below each field)

### Data Table Requirements

- MUST use TanStack Table v8 with typed column definitions
- MUST include columns: ID (if relevant), Name, related entities, status, actions
- MUST format currency using React Intl (`IntlProvider` with `pt-BR` locale)
- MUST provide edit action in each row (opens Sheet with form)
- MUST show delete confirmation dialog before deletion
- MUST display visual indicator for inactive products (e.g., opacity, badge)
- MUST show status badges for orders with color-coded states

### Navigation & Breadcrumb Rules

- Breadcrumbs MUST show: Home > [Resource] > [Action if applicable]
- Sidebar MUST highlight active route
- Sheet close/cancel MUST navigate back to list route
- Sheet save MUST navigate back to list route after successful mutation

## Storefront-Specific Rules (Phase 2)

When implementing the Storefront application, these additional rules apply:

### Architecture Mirroring

- MUST follow same `src/cases/[feature]/` structure as CMS
- Features: `products`, `cart`, `checkout`, `auth` (Storefront-specific)
- MUST reuse DTOs from CMS where entities overlap (e.g., `ProductDTO`)

### Authentication

- MUST use Supabase for authentication
- MUST implement: sign-up, sign-in, sign-out, session management
- MUST protect checkout flow (authenticated users only)

### Cart Management (Phase 1)

- MUST use LocalStorage for cart persistence (key: `ecommerce-cart`)
- MUST use React Context API for cart state (`CartContext` + `CartProvider`)
- Cart state: `{ items: CartItemDTO[], total: number }`
- MUST provide hooks: `useCart()`, `useAddToCart()`, `useRemoveFromCart()`, `useUpdateQuantity()`

### Data Separation

- CMS: Full CRUD operations on all entities
- Storefront: READ-ONLY for products/categories/brands, CREATE-ONLY for orders
- NO admin features in Storefront (no edit/delete for products)

## Governance

### Constitution Authority

This Constitution is the absolute source of truth for all AI-generated code and architectural decisions. In case of conflict:

1. Constitution overrides all other documentation
2. Technical specifications in `/docs` are secondary reference (must align with Constitution)
3. Individual task descriptions must conform to Constitution principles
4. Code review MUST verify Constitutional compliance

### Amendment Process

Amendments to this Constitution require:

1. Documentation of rationale (why change is needed)
2. Impact analysis on existing code and templates
3. Update to templates in `.specify/templates/` to reflect changes
4. Version bump following semantic versioning:
   - MAJOR: Breaking changes to core principles (e.g., removing a principle, changing tech stack major version)
   - MINOR: New principles added or significant expansion of existing rules
   - PATCH: Clarifications, typo fixes, non-semantic refinements

### Compliance & Enforcement

- ALL code generation tasks MUST reference Constitution principles
- Plan templates MUST include "Constitution Check" gates
- Task breakdowns MUST organize work by user stories aligned with architectural patterns
- Review checklist MUST verify adherence to:
  - Feature-based structure
  - DTOs-first approach
  - Service layer encapsulation
  - Hook-based state management
  - Component purity
  - Routing patterns
  - Styling consistency

### Complexity Justification

Any violation of core principles (I-VII) MUST be explicitly justified in the implementation plan with:

- Clear explanation of why compliance is not feasible
- Alternative approach that minimizes deviation
- Documented technical debt and remediation plan

**Version**: 1.0.0 | **Ratified**: 2025-11-22 | **Last Amended**: 2025-11-22
