import type { ProductDTO } from '../../catalog/dtos/product.dto';

export interface CartItemDTO {
  product: ProductDTO;
  quantity: number;
  lineTotal: number;
}
