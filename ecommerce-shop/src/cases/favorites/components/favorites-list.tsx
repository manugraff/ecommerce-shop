import { useFavorites } from '../../../contexts/favorites-context';
import { useProduct } from '../../catalog/hooks/use-product';
import { FavoriteProductCard } from './favorite-product-card';
import { EmptyFavoritesState } from './empty-favorites-state';
import { Skeleton } from '../../../components/ui/skeleton';

export function FavoritesList() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return <EmptyFavoritesState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {favorites.length === 1 ? '1 produto favorito' : `${favorites.length} produtos favoritos`}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <FavoriteProductItem
            key={favorite.id}
            productId={favorite.productId}
          />
        ))}
      </div>
    </div>
  );
}

interface FavoriteProductItemProps {
  productId: string;
}

function FavoriteProductItem({ productId }: FavoriteProductItemProps) {
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error || !product) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-gray-500 text-sm">Produto não encontrado</p>
      </div>
    );
  }

  return <FavoriteProductCard product={product} />;
}