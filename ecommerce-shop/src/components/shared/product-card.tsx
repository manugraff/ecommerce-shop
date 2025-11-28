import { useNavigate } from 'react-router-dom';
import type { ProductDTO } from '../../cases/catalog/dtos/product.dto';
import { formatBRL } from '../../lib/format-brl';
import { useCart } from '../../cases/cart/contexts/cart-context';
import { FavoriteButton } from '../../cases/favorites/components/favorite-button';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Package } from 'lucide-react';

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
    <Card
      onClick={handleCardClick}
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white overflow-hidden"
    >
      {}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-t-xl">
        {}
        <div className="h-full w-full object-cover bg-linear-to-br from-rose-50 to-pink-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Package className="h-16 w-16 text-rose-300" />
        </div>

        {}
        <div className="absolute top-3 right-3">
          <FavoriteButton
            productId={product.id}
            productName={product.name}
            size="md"
          />
        </div>
      </div>

      {}
      <div className="p-4">
        {}
        <h3 className="font-medium truncate text-gray-900 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>

        {}
        {product.brand && (
          <p className="text-sm text-muted-foreground mt-1">
            {product.brand.name}
          </p>
        )}

        {}
        <p className="text-sm text-rose-600 mt-1 font-medium">
          {product.category.name}
        </p>

        {}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-rose-600">
            {formatBRL(product.price)}
          </span>
        </div>

        {}
        <Button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white transition-colors"
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </Card>
  );
}