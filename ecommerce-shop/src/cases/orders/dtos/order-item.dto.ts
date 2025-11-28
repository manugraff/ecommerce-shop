import type { ProductDTO } from '../../catalog/dtos/product.dto';

export interface OrderItemDTO {
  id: number;
  product: ProductDTO;
  quantity: number;
  value: number;
}