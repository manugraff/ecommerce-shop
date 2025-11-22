import { useMemo } from 'react';
import { useDebounce } from '../../../lib/use-debounce';
import type { ProductDTO } from '../dtos';

interface UseProductSearchParams {
  products: ProductDTO[];
  searchQuery: string;
}

export function useProductSearch({ products, searchQuery }: UseProductSearchParams) {
  // Debounce search query to avoid excessive filtering
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Filter products based on debounced search query
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return products;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query) ?? false;
      const categoryMatch = product.category.name.toLowerCase().includes(query);
      const brandMatch = product.brand?.name.toLowerCase().includes(query) ?? false;

      return nameMatch || descriptionMatch || categoryMatch || brandMatch;
    });
  }, [products, debouncedQuery]);

  return {
    filteredProducts,
    isSearching: searchQuery !== debouncedQuery,
    hasResults: filteredProducts.length > 0,
    resultCount: filteredProducts.length,
  };
}
