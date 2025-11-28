import { useAuth } from '../../../contexts/auth-context';
import { useOrders } from './use-orders';

export function useMyOrders() {
  const { customerData } = useAuth();

  return useOrders(customerData?.id);
}