import { useOutletContext } from 'react-router-dom';
import { useProducts } from '../hooks/use-products';
import { useProductSearch } from '../hooks/use-product-search';
import { useCategories } from '../hooks/use-categories';
import { ProductCard } from '../../../components/shared/product-card';
import { EmptyState } from './empty-state';
import { ProductGridSkeleton } from '../../../components/ui/skeletons';
import { useState, useMemo } from 'react';

interface LayoutContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomePage() {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const { data: products, isLoading, error } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Apply search filter
  const { filteredProducts: searchFiltered, hasResults: hasSearchResults } = useProductSearch({
    products: products || [],
    searchQuery,
  });

  // Apply category filter to search results
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return searchFiltered;
    return searchFiltered.filter(product => product.category.id === selectedCategory);
  }, [searchFiltered, selectedCategory]);

  const hasResults = filteredProducts.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar skeleton */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-3 animate-pulse">
            <div className="h-6 bg-rose-200 rounded w-32" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-rose-100 rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content skeleton */}
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
      {/* Sidebar with Categories */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-5 sticky top-24">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Categorias</h3>
          
          {/* All Products option */}
          <div
            onClick={() => setSelectedCategory(null)}
            className={`hover:bg-rose-50 p-2 rounded cursor-pointer transition-colors mb-2 ${
              selectedCategory === null ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700'
            }`}
          >
            Todos os Produtos
          </div>
          
          {/* Category list */}
          {!categoriesLoading && categories && (
            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`hover:bg-rose-50 p-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === category.id ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
          
          {categoriesLoading && (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-rose-100 rounded" />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search results info */}
        {searchQuery && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-rose-800 font-medium">
              {hasResults 
                ? `${filteredProducts.length} produto(s) encontrado(s) para "${searchQuery}"`
                : `Nenhum produto encontrado para "${searchQuery}"`
              }
            </p>
          </div>
        )}
        
        {/* Selected category info */}
        {selectedCategory && categories && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Categoria: {categories.find(c => c.id === selectedCategory)?.name}
            </p>
          </div>
        )}
        
        {/* Products Grid */}
        {!hasResults ? (
          <EmptyState message={
            searchQuery 
              ? `Nenhum produto encontrado para "${searchQuery}"` 
              : selectedCategory 
              ? 'Nenhum produto encontrado nesta categoria'
              : 'Nenhum produto encontrado'
          } />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
