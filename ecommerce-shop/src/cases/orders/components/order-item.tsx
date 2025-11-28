import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './order-status-badge';
import { formatBRL } from '@/lib/format-brl';
import { Package, Star } from 'lucide-react';
import type { OrderDTO } from '../dtos';

interface OrderItemProps {
  order: OrderDTO;
  onClick?: (order: OrderDTO) => void;
  className?: string;
}

export function OrderItem({ order, onClick, className }: OrderItemProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  const handleReviewProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('Review product:', productId);
  };

  return (
    <Card
      className={`mb-4 transition-colors hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      onClick={handleClick}
    >
      {}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Pedido #{order.id}
          </p>
          <p className="text-xs text-gray-500">
            {orderDate}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>

      {}
      <CardContent className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {}
            <div className="w-12 h-12 bg-linear-to-br from-rose-50 to-pink-50 rounded-lg flex items-center justify-center shrink-0">
              <Package className="h-6 w-6 text-rose-300" />
            </div>

            {}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">
                Qtd: {item.quantity} • {formatBRL(item.product.price)} cada
              </p>
            </div>

            {}
            {order.status === 'DELIVERED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleReviewProduct(item.product.id, e)}
                className="shrink-0"
              >
                <Star className="h-3 w-3 mr-1" />
                Avaliar Produto
              </Button>
            )}
          </div>
        ))}
      </CardContent>

      {}
      <CardFooter className="pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-500">
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
            {order.shipping && order.shipping > 0 && (
              <span className="ml-2">• Frete: {formatBRL(order.shipping)}</span>
            )}
          </span>
          <span className="text-lg font-bold text-gray-900">
            Total: {formatBRL(order.total)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}