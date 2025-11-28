import { useProducts } from './use-products';

export function useProductsByCategory(categoryId: string) {
  return useProducts(categoryId);
}