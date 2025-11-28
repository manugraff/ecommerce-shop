import { api } from '../../../lib/axios';
import type { CustomerDTO, CreateCustomerDTO, CustomerCreationPayload } from '../dtos';

const sanitizeCustomerPayload = (data: CreateCustomerDTO): CustomerCreationPayload => {
  const payload: CustomerCreationPayload = {
    name: data.name
  };

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

    const cleanPayload = sanitizeCustomerPayload(data);

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