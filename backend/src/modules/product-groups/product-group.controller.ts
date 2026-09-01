import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
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

export async function deleteProductGroup(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  try {
    await prisma.productGroup.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new HttpError(400, 'Não é possível excluir este grupo porque ele está vinculado a produtos.');
    }

    throw error;
  }

  return res.status(204).send();
}
