import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useBrand } from '../hooks/use-brands';
import { useBrandProducts } from '../hooks/use-brand-products';
import { ProductCard } from '../../catalog/components/product-card';
import { Skeleton } from '../../../components/ui/skeleton';

export function BrandPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const { data: brand, isLoading: brandLoading, error: brandError } = useBrand(brandId || '');
  const { data: products, isLoading: productsLoading, error: productsError } = useBrandProducts(brandId || '');

  if (brandLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (brandError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Marca não encontrada
          </h1>
          <p className="text-gray-500 mb-6">
            A marca que você procura não existe ou foi removida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-rose-600 transition-colors">
          Home
        </Link>
        <span>•</span>
        <span>Marcas</span>
        <span>•</span>
        <span className="text-gray-900">{brand?.name}</span>
      </nav>

      {}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-rose-50 rounded-full">
          <Star className="h-8 w-8 text-rose-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {brand?.name}
          </h1>
          {brand?.description && (
            <p className="text-gray-600 mt-2">
              {brand.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {products?.length || 0} produtos disponíveis
          </p>
        </div>
      </div>

      {}
      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-96 w-full" />
          ))}
        </div>
      ) : productsError ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Erro ao carregar produtos desta marca.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-rose-600 hover:text-rose-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Nenhum produto encontrado para esta marca.
          </p>
          <Link
            to="/"
            className="text-rose-600 hover:text-rose-700 transition-colors"
          >
            Explorar outros produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}