import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyOrdersStateProps {
  className?: string;
}

export function EmptyOrdersState({ className }: EmptyOrdersStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className || ''}`}>
      <div className="mb-4 p-3 rounded-full bg-gray-100">
        <ShoppingBag className="h-8 w-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Você ainda não fez nenhum pedido
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md">
        Que tal explorar nossos produtos e fazer sua primeira compra? 
        Temos uma variedade incrível esperando por você.
      </p>
      
      <Button 
        variant="default"
        onClick={() => window.location.href = '/'}
        className="inline-flex items-center gap-2"
      >
        Explorar Produtos
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}