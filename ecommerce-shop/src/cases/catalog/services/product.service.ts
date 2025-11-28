import { api } from '../../../lib/axios';
import type { ProductDTO } from '../dtos/product.dto';

export class ProductService {

  static async list(): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products');
    return response.data;
  }

  static async listByCategory(categoryId: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products', {
      params: { categoryId },
    });
    return response.data;
  }

  static async listByBrand(brandId: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products', {
      params: { brandId },
    });
    return response.data;
  }

  static async getById(id: string): Promise<ProductDTO> {
    const response = await api.get<ProductDTO>(`/products/${id}`);
    return response.data;
  }
}