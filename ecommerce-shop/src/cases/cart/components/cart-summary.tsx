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
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">{formatBRL(subtotal)}</span>
      </div>
      <button className="w-full bg-linear-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
        ✨ Finalizar Compra
      </button>
    </div>
  );
}
