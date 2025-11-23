import { useAuth } from '../../../contexts/auth-context';
import { useOrders } from './use-orders';

/**
 * Hook that provides orders for the currently authenticated user
 * Automatically handles customer ID lookup from auth context
 */
export function useMyOrders() {
  const { customerData } = useAuth();
  
  return useOrders(customerData?.id);
}