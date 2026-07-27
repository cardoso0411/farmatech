import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createPaymentMethodConfigSchema } from './payment-method-config.schemas';

export async function listPaymentMethodConfigs(_req: Request, res: Response) {
  const paymentMethods = await prisma.paymentMethodConfig.findMany({
    orderBy: [{ description: 'asc' }],
  });

  return res.json({ paymentMethods });
}

export async function createPaymentMethodConfig(req: Request, res: Response) {
  const data = createPaymentMethodConfigSchema.parse(req.body);
  const paymentMethod = await prisma.paymentMethodConfig.create({ data });

  return res.status(201).json({
    message: 'Forma de pagamento cadastrada com sucesso.',
    paymentMethod,
  });
}

export async function deletePaymentMethodConfig(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await prisma.paymentMethodConfig.delete({ where: { id } });
  return res.status(204).send();
}
