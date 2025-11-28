import { useNavigate } from 'react-router-dom';
import type { ProductDTO } from '../dtos/product.dto';
import { ProductImage } from './product-image';
import { formatBRL } from '../../../lib/format-brl';
import { useCart } from '../../cart/contexts/cart-context';
import { FavoriteButton } from '../../favorites/components/favorite-button';

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

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
        <FavoriteButton
          productId={product.id}
          productName={product.name}
          size="md"
          className="absolute top-2 right-2"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate text-gray-800 group-hover:text-rose-600 transition-colors">{product.name}</h3>
        <p className="text-sm text-rose-600 mb-1 font-medium">{product.category.name}</p>
        {product.brand && (
          <p className="text-xs text-gray-500 mb-3">{product.brand.name}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-rose-600">
            {formatBRL(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-linear-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}