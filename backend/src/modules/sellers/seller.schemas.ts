import { z } from 'zod';

export const createSellerSchema = z.object({
  code: z.string().max(20).optional(),
  name: z.string().min(2, 'Nome do vendedor deve ter ao menos 2 caracteres.'),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
});
