import { api } from '../lib/axios';
import type { ProductDTO } from '../cases/catalog/dtos/product.dto';
import type { CategoryDTO } from '../cases/catalog/dtos/category.dto';

export const CatalogService = {
  /**
   * Lista todos os produtos ativos
   * @returns Promise com array de produtos
   */
  async getProducts(): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products');
    return response.data;
  },

  /**
   * Lista produtos filtrados por categoria
   * @param categoryId - UUID da categoria
   * @returns Promise com array de produtos
   */
  async getProductsByCategory(categoryId: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>('/products', {
      params: { categoryId },
    });
    return response.data;
  },

  /**
   * Busca um produto específico por ID
   * @param id - UUID do produto
   * @returns Promise com dados do produto
   */
  async getProductById(id: string): Promise<ProductDTO> {
    const response = await api.get<ProductDTO>(`/products/${id}`);
    return response.data;
  },

  /**
   * Lista todas as categorias
   * @returns Promise com array de categorias
   */
  async getCategories(): Promise<CategoryDTO[]> {
    const response = await api.get<CategoryDTO[]>('/categories');
    return response.data;
  },
};
