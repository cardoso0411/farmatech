import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres.'),
  cpfCnpj: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  birthDate: z.string().datetime().optional(),
  insurance: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});
