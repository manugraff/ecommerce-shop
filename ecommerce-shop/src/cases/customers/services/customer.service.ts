import { api } from '../../../lib/axios';
import type { CustomerDTO, CreateCustomerDTO } from '../dtos';

export const customerService = {
  async create(data: CreateCustomerDTO): Promise<CustomerDTO> {
    const response = await api.post<CustomerDTO>('/customers', data);
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
