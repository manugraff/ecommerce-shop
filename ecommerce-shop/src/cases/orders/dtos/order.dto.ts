import type { CustomerDTO } from '../../customers/dtos/customer.dto';
import type { OrderItemDTO } from './order-item.dto';

export interface OrderDTO {
  id: number;
  customer: CustomerDTO;
  items: OrderItemDTO[];
  total: number;
  shipping?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
