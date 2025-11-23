import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EmptyFavoritesState() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8 text-rose-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum favorito ainda
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Você ainda não favoritou nenhum produto. Explore nossa coleção e adicione produtos que você gosta!
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Explorar Produtos
      </button>
    </div>
  );
}