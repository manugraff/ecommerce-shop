import type { CategoryDTO } from './category.dto';
import type { BrandDTO } from './brand.dto';

export interface ProductDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  category: CategoryDTO;
  brand?: BrandDTO;
}