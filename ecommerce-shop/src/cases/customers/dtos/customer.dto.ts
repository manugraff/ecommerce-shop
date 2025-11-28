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

export interface CreateCustomerDTO {
  name: string;
  address?: string;
  zipcode?: string;
  cityId?: string;
}

export interface CustomerCreationPayload {
  name: string;
  address?: string;
  zipcode?: string;
  city?: {
    id: string;
  };
}