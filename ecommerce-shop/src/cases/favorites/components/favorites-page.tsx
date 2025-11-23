import { FavoritesList } from './favorites-list';

export function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Meus Favoritos
          </h1>
          <p className="text-gray-600 mt-1">
            Produtos que você marcou como favoritos
          </p>
        </div>
        
        <FavoritesList />
      </div>
    </div>
  );
}