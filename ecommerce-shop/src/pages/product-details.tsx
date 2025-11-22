import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../cases/catalog/hooks/use-product';
import { ProductDetail } from '../cases/catalog/components/product-detail';
import { useCart } from '../cases/cart/contexts/cart-context';
import { useToast } from '../contexts/toast-context';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { ProductDetailSkeleton } from '../components/ui/product-detail-skeleton';

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
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Produto não encontrado</h2>
          <p className="text-red-600 mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
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
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm mb-6 text-gray-600">
        <Link to="/" className="hover:text-gray-900">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to={`/category/${product.category.id}`} className="hover:text-gray-900">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar
      </button>

      {/* Product Details */}
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  );
}
