import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createProductCategorySchema } from './product-category.schemas';

export async function listProductCategories(_req: Request, res: Response) {
  const categories = await prisma.productCategory.findMany({
    orderBy: [{ code: 'asc' }, { name: 'asc' }],
  });

  return res.json({ categories });
}

export async function createProductCategory(req: Request, res: Response) {
  const data = createProductCategorySchema.parse(req.body);

  const category = await prisma.productCategory.create({
    data,
  });

  return res.status(201).json({
    message: 'Categoria cadastrada com sucesso.',
    category,
  });
}

export async function deleteProductCategory(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  try {
    await prisma.productCategory.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new HttpError(400, 'Não é possível excluir esta categoria porque ela está vinculada a produtos.');
    }

    throw error;
  }

  return res.status(204).send();
}
