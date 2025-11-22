import { useQuery } from '@tanstack/react-query';
import { CatalogService } from '../../services/catalog.service';

/**
 * Hook para buscar todas as categorias
 * @returns Query com lista de categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CatalogService.getCategories(),
  });
}
