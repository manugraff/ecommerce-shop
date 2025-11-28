import { formatBRL } from '../../../lib/format-brl';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="border-t-2 border-rose-200 pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-rose-700 font-medium">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
        <span className="text-sm text-gray-500">Subtotal</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">{formatBRL(subtotal)}</span>
      </div>
    </div>
  );
}