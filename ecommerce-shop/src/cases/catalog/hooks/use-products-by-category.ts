import { useProducts } from './use-products';

/**
 * Hook to fetch products filtered by category
 * @param categoryId - UUID of the category to filter by
 */
export function useProductsByCategory(categoryId: string) {
  return useProducts(categoryId);
}
