import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export function useOrders(customerId?: number) {
  return useQuery({
    queryKey: ['orders', customerId],
    queryFn: () => orderService.getByCustomerId(customerId!),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}