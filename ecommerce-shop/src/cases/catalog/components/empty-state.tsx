import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nenhum produto encontrado' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="bg-linear-to-br from-rose-50 to-pink-50 rounded-full p-6 mb-6">
        <Sparkles className="h-16 w-16 text-rose-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Ops!</h3>
      <p className="text-gray-500 text-center max-w-md">{message}</p>
      <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros ou buscar por outro termo</p>
    </div>
  );
}