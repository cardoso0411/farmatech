import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CustomerTypeOption, SellerOption } from '../types/customer-support';

export function useCustomerSupport() {
  const customerTypesQuery = useQuery({
    queryKey: ['customer-types'],
    queryFn: async () => {
      const response = await api.get<{ customerTypes: CustomerTypeOption[] }>('/customer-types');
      return response.data.customerTypes;
    },
  });

  const sellersQuery = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await api.get<{ sellers: SellerOption[] }>('/sellers');
      return response.data.sellers;
    },
  });

  return {
    customerTypesQuery,
    sellersQuery,
  };
}
