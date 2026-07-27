import { z } from 'zod';

export const createSellerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres.').max(150),
  username: z.string().trim().min(1, 'Usuário é obrigatório.').max(50),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.').max(100),
  role: z.enum(['ADMIN', 'ATTENDANT']),
  cpf: z.string().trim().min(11, 'CPF é obrigatório.').max(20),
  rg: z.string().trim().min(1, 'RG é obrigatório.').max(20),
  zipCode: z.string().trim().min(8, 'CEP é obrigatório.').max(10),
  address: z.string().trim().min(2, 'Endereço é obrigatório.').max(150),
  district: z.string().trim().min(2, 'Bairro é obrigatório.').max(100),
  city: z.string().trim().min(2, 'Cidade é obrigatória.').max(100),
  state: z.string().trim().length(2, 'Informe a sigla do estado.').transform((value) => value.toUpperCase()),
  mobilePhone: z.string().trim().min(10, 'Celular é obrigatório.').max(20),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email('E-mail inválido.').optional().or(z.literal('')),
  observation: z.string().trim().max(2000).optional(),
});
