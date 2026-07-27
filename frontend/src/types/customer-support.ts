export type CustomerTypeOption = {
  id: string;
  name: string;
  description?: string | null;
};

export type SellerOption = {
  id: string;
  code?: string | null;
  name: string;
  username?: string | null;
  role?: 'ADMIN' | 'MANAGER' | 'ATTENDANT';
  cpf?: string | null;
  mobilePhone?: string | null;
};
