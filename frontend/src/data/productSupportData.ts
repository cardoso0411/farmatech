export type ProductCategoryOption = {
  id: string;
  code: string;
  name: string;
};

export type ProductGroupOption = {
  id: string;
  local: string;
  group: string;
  sngpc: string;
  saleOperation: string;
  code: string;
  caution: string;
};

export const productCategoryOptions: ProductCategoryOption[] = [
  { id: 'cat-1', code: '001', name: 'Analgésicos' },
  { id: 'cat-2', code: '002', name: 'Antibióticos' },
  { id: 'cat-3', code: '003', name: 'Vitaminas' },
];

export const productGroupOptions: ProductGroupOption[] = [
  {
    id: 'grp-1',
    local: 'Gôndola A',
    group: 'Medicamentos isentos',
    sngpc: 'Não controlado',
    saleOperation: 'Venda balcão',
    code: 'G001',
    caution: 'Sem cuidado especial',
  },
  {
    id: 'grp-2',
    local: 'Armário controlado',
    group: 'Controlados',
    sngpc: 'Portaria 344',
    saleOperation: 'Receita obrigatória',
    code: 'G002',
    caution: 'Guardar trancado',
  },
  {
    id: 'grp-3',
    local: 'Geladeira',
    group: 'Termolábeis',
    sngpc: 'Não controlado',
    saleOperation: 'Venda refrigerada',
    code: 'G003',
    caution: 'Manter refrigerado',
  },
];
