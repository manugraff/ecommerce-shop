import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hooks/use-product';
import { ProductDetail } from './product-detail';
import { useCart } from '../../cart/contexts/cart-context';
import { useToast } from '../../../contexts/toast-context';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { ProductDetailSkeleton } from '../../../components/ui/product-detail-skeleton';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart } = useCart();
  const { success } = useToast();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Produto não encontrado</h2>
          <p className="text-red-600 mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {}
      <nav className="flex items-center text-sm mb-6 text-gray-600">
        <Link to="/" className="hover:text-rose-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-rose-400" />
        <Link to={`/category/${product.category.id}`} className="hover:text-rose-600 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-rose-400" />
        <span className="bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent font-medium">{product.name}</span>
      </nav>

      {}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar
      </button>

      {}
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  );
}