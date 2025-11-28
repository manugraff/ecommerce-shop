import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {}
        <div className="flex items-center justify-between p-4 border-b-2 border-rose-100 bg-linear-to-r from-rose-50 to-pink-50">
          <h2 className="text-xl font-bold bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>🛍️</span> Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-600"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {cart.items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </>
          )}
        </div>

        {}
        {cart.items.length > 0 && (
          <div className="p-4 border-t-2 border-rose-100 bg-linear-to-r from-rose-50 to-pink-50 space-y-3">
            <CartSummary subtotal={cart.subtotal} itemCount={cart.itemCount} />
            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}