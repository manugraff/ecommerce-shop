import { useQuery } from '@tanstack/react-query';
import { CatalogService } from '../../services/catalog.service';

/**
 * Hook para buscar um produto específico por ID
 * @param id - UUID do produto
 * @returns Query com dados do produto
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => CatalogService.getProductById(id),
    enabled: !!id,
  });
}
