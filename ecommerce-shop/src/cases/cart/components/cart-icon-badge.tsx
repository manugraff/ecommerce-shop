import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/cart-context';

export function CartIconBadge() {
  const { cart } = useCart();

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {cart.itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cart.itemCount}
        </span>
      )}
    </div>
  );
}