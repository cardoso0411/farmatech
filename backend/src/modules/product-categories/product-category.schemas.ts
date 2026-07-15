import { z } from 'zod';

export const createProductCategorySchema = z.object({
  code: z.string().trim().min(1, 'Código é obrigatório.').max(20),
  name: z.string().trim().min(2, 'Categoria é obrigatória.').max(120),
});
