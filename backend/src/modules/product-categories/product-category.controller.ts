import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
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
