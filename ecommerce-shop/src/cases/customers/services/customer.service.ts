import { api } from '../../../lib/axios';
import type { CustomerDTO, CreateCustomerDTO, CustomerCreationPayload } from '../dtos';

/**
 * Sanitizes customer data for backend API compliance
 * Removes unauthorized fields and formats data according to backend specification
 * @param data - Raw customer data from form
 * @returns Clean payload matching backend API contract
 */
const sanitizeCustomerPayload = (data: CreateCustomerDTO): CustomerCreationPayload => {
  const payload: CustomerCreationPayload = {
    name: data.name
  };

  // Only include optional fields if they have valid values
  if (data.address && data.address.trim()) {
    payload.address = data.address.trim();
  }

  if (data.zipcode && /^\d{8}$/.test(data.zipcode)) {
    payload.zipcode = data.zipcode;
  }

  if (data.cityId) {
    payload.city = { id: data.cityId };
  }

  return payload;
};

export const customerService = {
  async create(data: CreateCustomerDTO): Promise<CustomerDTO> {
    // Clean payload before sending to backend
    const cleanPayload = sanitizeCustomerPayload(data);
    
    // Debug logging for payload verification (temporary)
    console.log('Payload enviado para Customers:', cleanPayload);
    
    const response = await api.post<CustomerDTO>('/customers', cleanPayload);
    return response.data;
  },

  async getBySupabaseId(supabaseUserId: string): Promise<CustomerDTO | null> {
    try {
      const response = await api.get<CustomerDTO[]>('/customers', {
        params: { supabaseUserId },
      });
      return response.data[0] || null;
    } catch (error) {
      return null;
    }
  },

  async getById(id: number): Promise<CustomerDTO> {
    const response = await api.get<CustomerDTO>(`/customers/${id}`);
    return response.data;
  },

  async update(id: number, data: Partial<CreateCustomerDTO>): Promise<CustomerDTO> {
    const response = await api.put<CustomerDTO>(`/customers/${id}`, data);
    return response.data;
  },

  async getByEmail(email: string): Promise<CustomerDTO | null> {
    try {
      const response = await api.get<CustomerDTO[]>('/customers', {
        params: { email },
      });
      return response.data[0] || null;
    } catch (error) {
      return null;
    }
  },
};
