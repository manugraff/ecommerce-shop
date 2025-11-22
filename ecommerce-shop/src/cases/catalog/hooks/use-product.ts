import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getById(id),
    enabled: !!id,
  });
}
