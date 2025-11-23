import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { OrderStatusBadge } from './order-status-badge';
import { formatBRL } from '@/lib/format-brl';
import type { OrderDTO } from '@/cases/orders/dtos';

interface OrderCardProps {
  order: OrderDTO;
  onClick?: (order: OrderDTO) => void;
  className?: string;
}

export function OrderCard({ order, onClick, className }: OrderCardProps) {
  // Format date using Intl API
  const orderDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(order.createdAt));

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  return (
    <Card 
      className={`transition-colors hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      onClick={handleClick}
    >
      {/* Cabeçalho com Data e Status Badge */}
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              Pedido #{order.id}
            </p>
            <p className="text-xs text-gray-500">
              {orderDate}
            </p>
          </div>
          
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      
      {/* Corpo com Lista de Itens */}
      <CardContent className="pt-0">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Itens:</h4>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex-1 mr-2">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatBRL(item.value * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Frete se houver */}
          {order.shipping && order.shipping > 0 && (
            <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-100">
              <span className="text-gray-600">Frete:</span>
              <span className="text-gray-900 font-medium">
                {formatBRL(order.shipping)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Rodapé com Valor Total em Destaque */}
      <CardFooter className="pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center w-full">
          <span className="text-base font-semibold text-gray-700">
            Total:
          </span>
          <span className="text-xl font-bold text-gray-900">
            {formatBRL(order.total)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}