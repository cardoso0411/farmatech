import { z } from 'zod';

export const createPaymentMethodConfigSchema = z.object({
  abbreviation: z.string().trim().min(1, 'A abreviação é obrigatória.').max(10).transform((value) => value.toUpperCase()),
  description: z.string().trim().min(2, 'A descrição é obrigatória.').max(120),
});
