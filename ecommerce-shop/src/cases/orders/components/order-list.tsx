import { useMyOrders } from '../hooks';
import { OrderItem } from './order-item';
import { EmptyOrdersState } from './empty-orders-state';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderDTO } from '../dtos';

interface OrderListProps {
  onOrderClick?: (order: OrderDTO) => void;
  className?: string;
}

export function OrderList({ onOrderClick, className }: OrderListProps) {
  const { data: orders, isLoading, error, refetch } = useMyOrders();

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className || ''}`}>
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1 space-y-3">
              <p className="text-red-800">
                Erro ao carregar pedidos. Tente novamente.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={className}>
        <EmptyOrdersState />
      </div>
    );
  }

  // Sort orders by most recent first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Seus Pedidos ({orders.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {sortedOrders.map((order) => (
          <OrderItem 
            key={order.id} 
            order={order}
            onClick={onOrderClick}
          />
        ))}
      </div>
    </div>
  );
}