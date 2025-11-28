import { useQuery } from '@tanstack/react-query';
import { BrandService } from '../services/brand-service';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => BrandService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: () => BrandService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}