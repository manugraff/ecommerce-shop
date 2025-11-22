import type { CartItemDTO } from '../dtos/cart-item.dto';
import { formatBRL } from '../../../lib/format-brl';
import { useCart } from '../contexts/cart-context';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemDTO;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="flex-1">
        <h4 className="font-semibold">{item.product.name}</h4>
        <p className="text-sm text-gray-600">{item.product.category.name}</p>
        <p className="text-sm font-semibold text-green-600 mt-1">
          {formatBRL(item.product.price)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">{formatBRL(item.lineTotal)}</span>
          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
