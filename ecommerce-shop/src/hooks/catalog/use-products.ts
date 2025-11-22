import { useQuery } from '@tanstack/react-query';
import { CatalogService } from '../../services/catalog.service';

/**
 * Hook para buscar todos os produtos ou filtrados por categoria
 * @param categoryId - UUID da categoria (opcional)
 * @returns Query com lista de produtos
 */
export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => 
      categoryId 
        ? CatalogService.getProductsByCategory(categoryId)
        : CatalogService.getProducts(),
  });
}
