import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createProductGroupSchema } from './product-group.schemas';

export async function listProductGroups(_req: Request, res: Response) {
  const groups = await prisma.productGroup.findMany({
    orderBy: [{ code: 'asc' }, { groupName: 'asc' }],
  });

  return res.json({ groups });
}

export async function createProductGroup(req: Request, res: Response) {
  const data = createProductGroupSchema.parse(req.body);

  const group = await prisma.productGroup.create({
    data,
  });

  return res.status(201).json({
    message: 'Grupo cadastrado com sucesso.',
    group,
  });
}
