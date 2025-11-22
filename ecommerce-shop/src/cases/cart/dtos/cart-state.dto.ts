import type { CartItemDTO } from './cart-item.dto';

export interface CartStateDTO {
  items: CartItemDTO[];
  subtotal: number;
  itemCount: number;
}
