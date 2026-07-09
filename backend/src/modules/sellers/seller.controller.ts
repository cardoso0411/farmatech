import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createSellerSchema } from './seller.schemas';

export async function listSellers(_req: Request, res: Response) {
  const sellers = await prisma.seller.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return res.json({ sellers });
}

export async function createSeller(req: Request, res: Response) {
  const data = createSellerSchema.parse(req.body);

  const seller = await prisma.seller.create({
    data,
  });

  return res.status(201).json({
    message: 'Vendedor cadastrado com sucesso.',
    seller,
  });
}
