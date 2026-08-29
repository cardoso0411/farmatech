import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createCustomerTypeSchema } from './customer-type.schemas';

export async function listCustomerTypes(_req: Request, res: Response) {
  const customerTypes = await prisma.customerType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return res.json({ customerTypes });
}

export async function createCustomerType(req: Request, res: Response) {
  const data = createCustomerTypeSchema.parse(req.body);

  const customerType = await prisma.customerType.create({
    data,
  });

  return res.status(201).json({
    message: 'Tipo de cliente cadastrado com sucesso.',
    customerType,
  });
}

export async function deleteCustomerType(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await prisma.customerType.delete({ where: { id } });
  return res.status(204).send();
}
