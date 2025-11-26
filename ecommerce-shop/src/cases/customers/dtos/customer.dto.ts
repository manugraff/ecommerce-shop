export interface CustomerDTO {
  id: number;
  supabaseUserId: string;
  name: string;
  email: string;
  address?: string;
  zipcode?: string;
  city?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Updated DTO for creating customers - aligned with backend API specification
 * Only includes fields accepted by the backend /customers endpoint
 */
export interface CreateCustomerDTO {
  name: string;            // Required field
  address?: string;        // Optional, max 250 characters
  zipcode?: string;        // Optional, exactly 8 digits, no hyphen
  cityId?: string;         // Optional, UUID for city selection
}

/**
 * Exact payload format expected by backend API POST /customers
 * @see contracts/customer-creation.md for complete API specification
 */
export interface CustomerCreationPayload {
  name: string;                    // Required field
  address?: string;                // Optional, only if provided and non-empty
  zipcode?: string;                // Optional, only if valid 8-digit format
  city?: {                         // Optional, city reference as object
    id: string;                    // UUID reference to city entity
  };
}
