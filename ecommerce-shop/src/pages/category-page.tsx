import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductsByCategory } from '../cases/catalog/hooks/use-products-by-category';
import { useProductSearch } from '../cases/catalog/hooks/use-product-search';
import { useCategories } from '../cases/catalog/hooks/use-categories';
import { ProductGrid } from '../cases/catalog/components/product-grid';
import { EmptyState } from '../cases/catalog/components/empty-state';
import { MainLayout } from '../components/layout/main-layout';
import { ChevronRight } from 'lucide-react';

export function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: products, isLoading: productsLoading, error: productsError } = useProductsByCategory(categoryId!);
  const { data: categories } = useCategories();

  const currentCategory = categories?.find((cat) => cat.id === categoryId);
  
  // Apply search filter to category products
  const { filteredProducts, hasResults } = useProductSearch({
    products: products || [],
    searchQuery,
  });

  if (productsLoading) {
    return (
      <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (productsError) {
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
      <div>
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6 text-gray-600">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">
            {currentCategory?.name || 'Categoria'}
          </span>
        </nav>

        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {currentCategory?.name || 'Produtos'}
          </h1>
          {searchQuery && (
            <p className="text-gray-600 mt-2">
              {hasResults 
                ? `${filteredProducts.length} produto(s) encontrado(s) para "${searchQuery}"`
                : `Nenhum produto encontrado para "${searchQuery}"`
              }
            </p>
          )}
        </div>

        {/* Products Grid */}
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
    </MainLayout>
  );
}
