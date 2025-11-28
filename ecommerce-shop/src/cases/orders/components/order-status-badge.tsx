import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  NEW: {
    label: 'Novo',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  SEPARATION: {
    label: 'Em Separação',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
  },
  INVOICED: {
    label: 'Faturado',
    className: 'bg-violet-100 text-violet-800 hover:bg-violet-200'
  },
  SHIPPED: {
    label: 'Enviado',
    className: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
  },
  DELIVERED: {
    label: 'Entregue',
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  CANCELED: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
} as const;

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge variant="outline" className={cn('text-gray-600', className)}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}