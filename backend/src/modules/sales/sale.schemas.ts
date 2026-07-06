import { z } from 'zod';

export const createSaleSchema = z.object({
  customerId: z.string().optional(),
  userId: z.string(),
  notes: z.string().max(1000).optional(),
  discountAmount: z.coerce.number().nonnegative().default(0),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().int().positive(),
      unitPrice: z.coerce.number().positive(),
      discount: z.coerce.number().nonnegative().default(0),
    })
  ).min(1, 'A venda deve ter ao menos um item.'),
  payments: z.array(
    z.object({
      method: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'INSURANCE', 'OTHER']),
      amount: z.coerce.number().positive(),
      reference: z.string().max(120).optional(),
    })
  ).min(1, 'A venda deve ter ao menos uma forma de pagamento.'),
});
