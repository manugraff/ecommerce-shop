import { Package } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nenhum produto encontrado' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Package className="h-16 w-16 mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
