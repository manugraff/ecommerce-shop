import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <ShoppingCart className="h-16 w-16 mb-4" />
      <p className="text-lg mb-4">Seu carrinho está vazio</p>
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
