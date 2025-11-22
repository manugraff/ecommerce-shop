import { useState } from 'react';
import { useProducts } from '../cases/catalog/hooks/use-products';
import { useProductSearch } from '../cases/catalog/hooks/use-product-search';
import { ProductGrid } from '../cases/catalog/components/product-grid';
import { EmptyState } from '../cases/catalog/components/empty-state';
import { CategoryFilter } from '../cases/catalog/components/category-filter';
import { MainLayout } from '../components/layout/main-layout';
import { ProductGridSkeleton } from '../components/ui/skeletons';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products, isLoading, error } = useProducts();
  
  // Apply search filter
  const { filteredProducts, hasResults } = useProductSearch({
    products: products || [],
    searchQuery,
  });

  if (isLoading) {
    return (
      <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar skeleton */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content skeleton */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
            <ProductGridSkeleton />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Erro ao carregar produtos. Tente novamente.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with Category Filter */}
        <aside className="md:col-span-1">
          <CategoryFilter />
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? 'Resultados da Busca' : 'Todos os Produtos'}
            </h2>
            {searchQuery && (
              <p className="text-gray-600 mt-1">
                {hasResults 
                  ? `${filteredProducts.length} produto(s) encontrado(s) para "${searchQuery}"`
                  : `Nenhum produto encontrado para "${searchQuery}"`
                }
              </p>
            )}
          </div>
          {!hasResults ? (
            <EmptyState message={searchQuery ? `Nenhum produto encontrado para "${searchQuery}"` : 'Nenhum produto encontrado'} />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
