import { api } from '../../../lib/axios';
import type { BrandDTO } from '../dtos/brand-dto';

export class BrandService {

  static async list(): Promise<BrandDTO[]> {
    const response = await api.get<BrandDTO[]>('/brands');
    return response.data;
  }

  static async getById(id: string): Promise<BrandDTO> {
    const response = await api.get<BrandDTO>(`/brands/${id}`);
    return response.data;
  }
}