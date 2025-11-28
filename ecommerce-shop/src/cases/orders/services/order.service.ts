import { api } from '../../../lib/axios';
import type { OrderDTO, CreateOrderDTO } from '../dtos';

export const orderService = {
  async createOrder(data: CreateOrderDTO): Promise<OrderDTO> {
    const response = await api.post<OrderDTO>('/orders', data);
    return response.data;
  },

  async getByCustomerId(customerId: number): Promise<OrderDTO[]> {
    const response = await api.get<OrderDTO[]>('/orders', {
      params: { customerId },
    });
    return response.data;
  },

  async listByCustomer(customerId: number): Promise<OrderDTO[]> {

    return this.getByCustomerId(customerId);
  },

  async getById(id: number): Promise<OrderDTO> {
    const response = await api.get<OrderDTO>(`/orders/${id}`);
    return response.data;
  },
};