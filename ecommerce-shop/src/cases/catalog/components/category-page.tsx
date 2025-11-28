import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useProductsByCategory } from '../hooks/use-products-by-category';
import { useProductSearch } from '../hooks/use-product-search';
import { useCategories } from '../hooks/use-categories';
import { ProductGrid } from './product-grid';
import { EmptyState } from './empty-state';
import { ChevronRight } from 'lucide-react';

interface LayoutContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function CategoryPage() {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: products, isLoading: productsLoading, error: productsError } = useProductsByCategory(categoryId!);
  const { data: categories } = useCategories();

  const currentCategory = categories?.find((cat) => cat.id === categoryId);

  const { filteredProducts, hasResults } = useProductSearch({
    products: products || [],
    searchQuery,
  });

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-rose-600 font-medium">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Erro ao carregar produtos. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {}
      <nav className="flex items-center text-sm mb-6 text-gray-600">
        <Link to="/" className="hover:text-rose-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-rose-400" />
        <span className="bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent font-medium">
          {currentCategory?.name || 'Categoria'}
        </span>
      </nav>

      {}
      {searchQuery && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p className="text-rose-800 font-medium">
            {hasResults
              ? `${filteredProducts.length} produto(s) encontrado(s) para "${searchQuery}" em ${currentCategory?.name || 'esta categoria'}`
              : `Nenhum produto encontrado para "${searchQuery}" em ${currentCategory?.name || 'esta categoria'}`
            }
          </p>
        </div>
      )}

      {}
      {!hasResults ? (
        <EmptyState message={
          searchQuery
            ? `Nenhum produto encontrado para "${searchQuery}" nesta categoria`
            : "Nenhum produto encontrado nesta categoria"
        } />
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
}