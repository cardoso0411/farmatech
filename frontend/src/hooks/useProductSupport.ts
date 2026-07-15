import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { ProductCategoryOption, ProductGroupOption } from '../types/product-support';

export function useProductSupport() {
  const categoriesQuery = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await api.get<{ categories: ProductCategoryOption[] }>('/product-categories');
      return response.data.categories;
    },
  });

  const groupsQuery = useQuery({
    queryKey: ['product-groups'],
    queryFn: async () => {
      const response = await api.get<{ groups: ProductGroupOption[] }>('/product-groups');
      return response.data.groups;
    },
  });

  return {
    categoriesQuery,
    groupsQuery,
  };
}
