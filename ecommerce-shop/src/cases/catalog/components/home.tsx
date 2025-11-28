import { useOutletContext } from 'react-router-dom';
import { useProducts } from '../hooks/use-products';
import { useProductSearch } from '../hooks/use-product-search';
import { ProductCard } from '../../../components/shared/product-card';
import { EmptyState } from './empty-state';
import { ProductGridSkeleton } from '../../../components/ui/skeletons';
import { SidebarCategoryMenu } from './sidebar-category-menu';
import { SidebarBrandMenu } from '../../brands/components/sidebar-brand-menu';

interface LayoutContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomePage() {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const { data: products, isLoading, error } = useProducts();

  const { filteredProducts: searchFiltered } = useProductSearch({
    products: products || [],
    searchQuery,
  });

  const hasResults = searchFiltered.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-5 animate-pulse">
            <div className="h-6 bg-rose-200 rounded w-32 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-rose-100 rounded" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-5 animate-pulse">
            <div className="h-6 bg-rose-200 rounded w-24 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-rose-100 rounded" />
              ))}
            </div>
          </div>
        </aside>

        {}
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Erro ao carregar produtos. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div className="sticky top-24 space-y-6">
          <SidebarCategoryMenu />
          <SidebarBrandMenu />
        </div>
      </aside>

      {}
      <div className="flex-1">
        {}
        {searchQuery && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-rose-800 font-medium">
              {hasResults
                ? `${searchFiltered.length} produto(s) encontrado(s) para "${searchQuery}"`
                : `Nenhum produto encontrado para "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {}
        {!hasResults ? (
          <EmptyState message={
            searchQuery
              ? `Nenhum produto encontrado para "${searchQuery}"`
              : 'Nenhum produto encontrado'
          } />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchFiltered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}