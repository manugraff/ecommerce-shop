import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ProductImage } from '../../catalog/components/product-image';
import { formatBRL } from '../../../lib/format-brl';
import { useFavorites } from '../../../contexts/favorites-context';
import { useToast } from '../../../contexts/toast-context';
import { useCart } from '../../cart/contexts/cart-context';
import type { ProductDTO } from '../../catalog/dtos/product.dto';

interface FavoriteProductCardProps {
  product: ProductDTO;
}

export function FavoriteProductCard({ product }: FavoriteProductCardProps) {
  const navigate = useNavigate();
  const { removeFavorite } = useFavorites();
  const { success } = useToast();
  const { addToCart } = useCart();

  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(product.id);
    success(`${product.name} removido dos favoritos`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-rose-100 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-rose-200"
    >
      <div className="relative">
        <ProductImage />
        <button
          onClick={handleRemoveFavorite}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 border border-rose-200 rounded-full flex items-center justify-center hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          title="Remover dos favoritos"
          aria-label="Remover dos favoritos"
        >
          <X className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate text-gray-800 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-rose-600 mb-1 font-medium">
          {product.category.name}
        </p>

        {product.brand && (
          <p className="text-xs text-gray-500 mb-3">
            {product.brand.name}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-rose-600">
            {formatBRL(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-linear-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}