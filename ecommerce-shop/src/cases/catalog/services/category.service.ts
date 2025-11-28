import { api } from '../../../lib/axios';
import type { CategoryDTO } from '../dtos/category.dto';

export class CategoryService {

  static async list(): Promise<CategoryDTO[]> {
    const response = await api.get<CategoryDTO[]>('/categories');
    return response.data;
  }
}