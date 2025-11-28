import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../customers/services/customer.service';

export function useMyCustomerProfile(email?: string) {
  return useQuery({
    queryKey: ['customer-profile', email],
    queryFn: async () => {
      if (!email) return null;

      const customer = await customerService.getByEmail(email);
      return customer;
    },
    enabled: !!email,
    staleTime: 10 * 60 * 1000,
  });
}