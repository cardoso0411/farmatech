import { z } from 'zod';

export const createProductGroupSchema = z.object({
  local: z.string().trim().min(1, 'Local é obrigatório.').max(120),
  groupName: z.string().trim().min(2, 'Grupo é obrigatório.').max(120),
  sngpc: z.string().trim().min(1, 'SNGPC é obrigatório.').max(120),
  saleOperation: z.string().trim().min(1, 'Operação de venda é obrigatória.').max(120),
  code: z.string().trim().min(1, 'Código é obrigatório.').max(20),
  caution: z.string().trim().min(1, 'Cuidado é obrigatório.').max(255),
});
