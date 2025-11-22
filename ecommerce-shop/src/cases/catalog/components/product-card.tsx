import { useNavigate } from 'react-router-dom';
import type { ProductDTO } from '../dtos/product.dto';
import { ProductImage } from './product-image';
import { formatBRL } from '../../../lib/format-brl';
import { useCart } from '../../cart/contexts/cart-context';
import { useToast } from '../../../contexts/toast-context';

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    success(`${product.name} adicionado ao carrinho!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
    >
      <ProductImage />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand.name}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-600">
            {formatBRL(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
