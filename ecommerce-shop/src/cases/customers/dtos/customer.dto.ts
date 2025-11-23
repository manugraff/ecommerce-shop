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
  supabaseUserId: string;
  name: string;
  email: string;
  address?: string;
  zipcode?: string;
  city?: string;
  state?: string;
}
