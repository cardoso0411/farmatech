import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createProductSchema } from './product.schemas';

export async function listProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return res.json({ products });
}

export async function createProduct(req: Request, res: Response) {
  const data = createProductSchema.parse(req.body);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      barcode: data.barcode,
      category: data.category,
      unit: data.unit,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      stockQuantity: data.stockQuantity,
      minimumStock: data.minimumStock,
    },
  });

  return res.status(201).json({
    message: 'Produto cadastrado com sucesso.',
    product,
  });
}
