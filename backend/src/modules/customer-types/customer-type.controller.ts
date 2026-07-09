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
