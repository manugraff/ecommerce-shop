# API Contracts: Storefront Catalog and Cart

**Feature**: 001-storefront-catalog  
**Date**: 2025-11-22  
**Backend API**: NestJS REST API (PostgreSQL + TypeORM)  
**Base URL**: `http://localhost:3000` (configured via `VITE_API_URL`)

---

## API Endpoints Overview

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/products` | GET | List all active products | No |
| `/products?categoryId=:id` | GET | List products by category | No |
| `/products/:id` | GET | Get single product details | No |
| `/categories` | GET | List all categories | No |

**Note**: All endpoints are read-only for the storefront. No authentication required in Phase 1.

---

## 1. List All Products

### Request

```http
GET /products HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**No query parameters required** for listing all products.

### Response (Success 200)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hydrating Face Serum",
    "description": "A lightweight serum that provides deep hydration for all skin types. Contains hyaluronic acid and vitamin E.",
    "price": 89.90,
    "active": true,
    "category": {
      "id": "cat-001",
      "name": "Skincare"
    },
    "brand": {
      "id": "brand-001",
      "name": "Glow Up Beauty"
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Matte Lipstick - Rose",
    "description": "Long-lasting matte lipstick with rich pigmentation.",
    "price": 45.90,
    "active": true,
    "category": {
      "id": "cat-002",
      "name": "Makeup"
    },
    "brand": {
      "id": "brand-002",
      "name": "Natural Radiance"
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Nourishing Shampoo",
    "description": null,
    "price": 65.50,
    "active": true,
    "category": {
      "id": "cat-003",
      "name": "Haircare"
    },
    "brand": null
  }
]
```

**Response Notes**:
- Returns array of ProductDTO objects
- Only products with `active: true` are returned
- `description` can be `null` or string
- `brand` can be `null` (optional relationship)
- `category` is always present (required relationship)
- Eager loaded relationships (category, brand) are fully populated

### Response (Error)

**Empty Catalog (200)**:
```json
[]
```

**Server Error (500)**:
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 2. List Products by Category

### Request

```http
GET /products?categoryId=cat-001 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Query Parameters**:
- `categoryId` (required): UUID of the category to filter by

### Response (Success 200)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hydrating Face Serum",
    "description": "A lightweight serum that provides deep hydration.",
    "price": 89.90,
    "active": true,
    "category": {
      "id": "cat-001",
      "name": "Skincare"
    },
    "brand": {
      "id": "brand-001",
      "name": "Glow Up Beauty"
    }
  }
  // ... other products in "Skincare" category
]
```

**Response Notes**:
- Returns only products matching the specified `categoryId`
- Same structure as `/products` endpoint
- Returns empty array `[]` if no products in category

### Response (Error)

**Invalid Category ID (empty results - 200)**:
```json
[]
```

**Bad Request (400)** - if categoryId is malformed:
```json
{
  "statusCode": 400,
  "message": "Invalid categoryId format",
  "error": "Bad Request"
}
```

---

## 3. Get Single Product

### Request

```http
GET /products/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Path Parameters**:
- `id` (required): UUID of the product

### Response (Success 200)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Hydrating Face Serum",
  "description": "A lightweight serum that provides deep hydration for all skin types. Contains hyaluronic acid and vitamin E for maximum moisture retention and skin repair.",
  "price": 89.90,
  "active": true,
  "category": {
    "id": "cat-001",
    "name": "Skincare"
  },
  "brand": {
    "id": "brand-001",
    "name": "Glow Up Beauty"
  }
}
```

**Response Notes**:
- Returns single ProductDTO object
- Full product details including description
- Eager loaded relationships populated

### Response (Error)

**Product Not Found (404)**:
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

**Invalid UUID Format (400)**:
```json
{
  "statusCode": 400,
  "message": "Invalid product ID format",
  "error": "Bad Request"
}
```

---

## 4. List All Categories

### Request

```http
GET /categories HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**No query parameters required**.

### Response (Success 200)

```json
[
  {
    "id": "cat-001",
    "name": "Skincare"
  },
  {
    "id": "cat-002",
    "name": "Makeup"
  },
  {
    "id": "cat-003",
    "name": "Haircare"
  },
  {
    "id": "cat-004",
    "name": "Fragrances"
  }
]
```

**Response Notes**:
- Returns array of CategoryDTO objects
- Simple structure (id, name only)
- Used for category filter menu

### Response (Error)

**Empty Categories (200)**:
```json
[]
```

**Server Error (500)**:
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## HTTP Status Codes Summary

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| **200 OK** | Success | All successful GET requests (including empty results) |
| **400 Bad Request** | Invalid input | Malformed UUID, invalid query params |
| **404 Not Found** | Resource not found | Product ID doesn't exist |
| **500 Internal Server Error** | Server error | Database connection issues, unexpected errors |

---

## Example Axios Service Implementation

```typescript
// src/cases/catalog/services/product.service.ts
import { api } from '@/lib/axios';
import type { ProductDTO } from '../dtos';

export const ProductService = {
  /**
   * List all active products
   * @returns Promise<ProductDTO[]>
   */
  async list(): Promise<ProductDTO[]> {
    const { data } = await api.get<ProductDTO[]>('/products');
    return data;
  },

  /**
   * List products by category
   * @param categoryId - UUID of the category
   * @returns Promise<ProductDTO[]>
   */
  async listByCategory(categoryId: string): Promise<ProductDTO[]> {
    const { data } = await api.get<ProductDTO[]>('/products', {
      params: { categoryId }
    });
    return data;
  },

  /**
   * Get single product by ID
   * @param id - UUID of the product
   * @returns Promise<ProductDTO>
   * @throws 404 if product not found
   */
  async getById(id: string): Promise<ProductDTO> {
    const { data } = await api.get<ProductDTO>(`/products/${id}`);
    return data;
  }
};
```

```typescript
// src/cases/catalog/services/category.service.ts
import { api } from '@/lib/axios';
import type { CategoryDTO } from '../dtos';

export const CategoryService = {
  /**
   * List all categories
   * @returns Promise<CategoryDTO[]>
   */
  async list(): Promise<CategoryDTO[]> {
    const { data } = await api.get<CategoryDTO[]>('/categories');
    return data;
  }
};
```

---

## Axios Configuration

```typescript
// lib/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Optional: Add request/response interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

---

## Environment Configuration

```env
# .env
VITE_API_URL=http://localhost:3000
```

**Note**: Vite requires env variables to be prefixed with `VITE_` to be exposed to client-side code.

---

## Testing with curl

**List all products**:
```bash
curl -X GET http://localhost:3000/products
```

**Filter by category**:
```bash
curl -X GET "http://localhost:3000/products?categoryId=cat-001"
```

**Get single product**:
```bash
curl -X GET http://localhost:3000/products/550e8400-e29b-41d4-a716-446655440000
```

**List categories**:
```bash
curl -X GET http://localhost:3000/categories
```

---

## CORS Configuration

Backend must enable CORS for frontend origin:

```typescript
// NestJS backend: main.ts
app.enableCors({
  origin: ['http://localhost:5173'], // Vite dev server
  methods: ['GET'],
  credentials: false
});
```

**Vite default dev port**: 5173

---

## Summary

- **4 endpoints**: All GET, read-only, no auth required
- **Consistent format**: All return JSON with standard NestJS error structure
- **Eager loading**: Relationships (category, brand) fully populated in responses
- **Type-safe**: TypeScript interfaces match backend entities exactly
- **Error handling**: Standard HTTP status codes (200, 400, 404, 500)
- **Ready for**: TanStack Query hooks integration
