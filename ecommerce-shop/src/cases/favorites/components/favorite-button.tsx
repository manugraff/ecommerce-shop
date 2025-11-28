import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../../contexts/favorites-context';
import { useAuth } from '../../../contexts/auth-context';
import { useToast } from '../../../contexts/toast-context';

interface FavoriteButtonProps {

  productId: string;

  size?: 'sm' | 'md' | 'lg';

  className?: string;

  productName?: string;
}

export function FavoriteButton({
  productId,
  size = 'md',
  className = '',
  productName = 'Produto'
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { success, error } = useToast();

  const isProductFavorited = isFavorite(productId);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      error('Você precisa estar logado para favoritar produtos');
      return;
    }

    try {
      toggleFavorite(productId);

      if (isProductFavorited) {
        success(`${productName} removido dos favoritos`);
      } else {
        success(`${productName} adicionado aos favoritos`);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error('Erro ao atualizar favoritos');
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full border transition-all duration-200
    hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500/20
    ${sizeClasses[size]}
  `;

  const favoriteClasses = isProductFavorited
    ? 'bg-rose-500 border-rose-500 text-white shadow-lg hover:bg-rose-600'
    : 'bg-white/90 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300';

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      className={`${baseClasses} ${favoriteClasses} ${className}`}
      title={isProductFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-label={isProductFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`${iconSizes[size]} drop-shadow-sm`}
        fill={isProductFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isProductFavorited ? 0 : 2.5}
      />
    </button>
  );
}