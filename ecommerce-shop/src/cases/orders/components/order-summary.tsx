import type { CartItemDTO } from '../../cart/dtos/cart-item.dto';
import { formatBRL } from '../../../lib/format-brl';

interface OrderSummaryProps {
  items: CartItemDTO[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between items-center py-3 border-b border-gray-200"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x {formatBRL(item.product.price)}
              </p>
            </div>
            <p className="font-semibold text-gray-900">
              {formatBRL(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">Total</p>
          <p className="text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {formatBRL(total)}
          </p>
        </div>
      </div>
    </div>
  );
}