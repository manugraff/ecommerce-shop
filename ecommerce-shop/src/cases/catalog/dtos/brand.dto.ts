export interface BrandDTO {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}