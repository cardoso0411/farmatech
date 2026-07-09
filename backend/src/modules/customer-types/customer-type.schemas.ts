import { z } from 'zod';

export const createCustomerTypeSchema = z.object({
  name: z.string().min(2, 'Nome do tipo deve ter ao menos 2 caracteres.'),
  description: z.string().max(255).optional(),
});
