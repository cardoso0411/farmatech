import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createProductSchema } from './product.schemas';

export async function listProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      group: true,
    },
    orderBy: {
      summary: 'asc',
    },
  });

  return res.json({ products });
}

export async function createProduct(req: Request, res: Response) {
  const data = createProductSchema.parse(req.body);

  const product = await prisma.product.create({
    data: {
      barcode: data.barcode,
      categoryId: data.categoryId,
      groupId: data.groupId,
      brand: data.brand,
      summary: data.summary,
      description: data.description,
      sngpc: data.sngpc,
      rms: data.rms,
      presentation: data.presentation,
      reference: data.reference,
      activeIngredient: data.activeIngredient,
      unit: data.unit,
      dcb: data.dcb,
      packageQuantity: data.packageQuantity,
      minimumStock: data.minimumQuantity,
      fractionQuantity: data.fractionQuantity,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      stockQuantity: data.stockQuantity,
      isGeneric: data.isGeneric,
      isControlled: data.isControlled,
      isSpecial: data.isSpecial,
      isFractioned: data.isFractioned,
      isSimilar: data.isSimilar,
      ncmCode: data.ncmCode,
      pisList: data.pisList,
      origin: data.origin,
      icms: data.icms,
      saleOperation: data.saleOperation,
      observation: data.observation,
    },
    include: {
      category: true,
      group: true,
    },
  });

  return res.status(201).json({
    message: 'Produto cadastrado com sucesso.',
    product,
  });
}
