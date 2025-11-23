export interface CreateOrderDTO {
  customer: {
    id: number;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shipping?: number;
}
