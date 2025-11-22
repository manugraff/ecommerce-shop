import type { ProductDTO } from '../dtos/product.dto';
import { ProductImage } from './product-image';
import { formatBRL } from '../../../lib/format-brl';

interface ProductDetailProps {
  product: ProductDTO;
  onAddToCart: () => void;
}

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <ProductImage />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg text-gray-600 mb-4">{product.category.name}</p>
        {product.brand && (
          <p className="text-sm text-gray-500 mb-4">Marca: {product.brand.name}</p>
        )}
        {product.description && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Descrição</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
        <div className="mb-6">
          <span className="text-3xl font-bold text-green-600">
            {formatBRL(product.price)}
          </span>
        </div>
        <button
          onClick={onAddToCart}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
