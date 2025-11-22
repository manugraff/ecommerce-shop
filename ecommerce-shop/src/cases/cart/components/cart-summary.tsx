import { formatBRL } from '../../../lib/format-brl';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
        <span className="text-sm text-gray-500">Subtotal</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">{formatBRL(subtotal)}</span>
      </div>
      <button className="w-full bg-green-600 text-white py-3 rounded-md mt-4 hover:bg-green-700 transition-colors font-semibold">
        Finalizar Compra
      </button>
    </div>
  );
}
