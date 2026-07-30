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
  rg?: string | null;
  zipCode?: string | null;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  observation?: string | null;
};
