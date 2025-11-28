import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  NEW: {
    label: 'Novo',
    className: 'bg-primary text-primary-foreground hover:bg-primary/90'
  },
  SEPARATION: {
    label: 'Em Separação',
    className: 'bg-amber-500 text-white hover:bg-amber-600'
  },
  INVOICED: {
    label: 'Faturado',
    className: 'bg-violet-500 text-white hover:bg-violet-600'
  },
  SHIPPED: {
    label: 'Enviado',
    className: 'bg-cyan-500 text-white hover:bg-cyan-600'
  },
  DELIVERED: {
    label: 'Entregue',
    className: 'bg-green-500 text-white hover:bg-green-600'
  },
  CANCELED: {
    label: 'Cancelado',
    className: 'bg-red-500 text-white hover:bg-red-600'
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
      className={cn(config.className, 'border-none', className)}
    >
      {config.label}
    </Badge>
  );
}