import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../../catalog/services/product.service';

export function useBrandProducts(brandId: string) {
  return useQuery({
    queryKey: ['products', 'brand', brandId],
    queryFn: async () => {

      const products = await ProductService.listByBrand(brandId);

      const filteredProducts = products.filter(
        (product) => product.brand?.id === brandId
      );

      if (filteredProducts.length === 0 && products.length > 0) {

        const hasMatchingBrand = products.some(p => p.brand?.id === brandId);
        if (!hasMatchingBrand) {

          return [];
        }
      }

      return filteredProducts.length > 0 ? filteredProducts : products;
    },
    enabled: !!brandId,
    staleTime: 2 * 60 * 1000,
  });
}