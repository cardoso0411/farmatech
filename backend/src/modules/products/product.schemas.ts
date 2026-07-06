import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome do produto deve ter ao menos 3 caracteres.'),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  category: z.string().max(80).optional(),
  unit: z.string().max(10).default('UN'),
  salePrice: z.coerce.number().positive('Preço de venda deve ser maior que zero.'),
  costPrice: z.coerce.number().nonnegative().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  minimumStock: z.coerce.number().int().nonnegative().default(0),
});
