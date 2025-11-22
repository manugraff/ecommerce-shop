import { api } from '../../../lib/axios';
import type { ProductDTO } from '../dtos/product.dto';

export class ProductService {
  /**
   * List all active products
   */
  static async list(): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products');
    return response.data;
  }

  /**
   * List products filtered by category ID
   */
  static async listByCategory(categoryId: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products', {
      params: { categoryId },
    });
    return response.data;
  }

  /**
   * Get a single product by ID
   */
  static async getById(id: string): Promise<ProductDTO> {
    const response = await api.get<ProductDTO>(`/products/${id}`);
    return response.data;
  }
}
