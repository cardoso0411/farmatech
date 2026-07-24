import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createProductSchema } from './product.schemas';

function mapProductData(data: ReturnType<typeof createProductSchema.parse>) {
  return {
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
  };
}

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

export async function getProductById(req: Request, res: Response) {
  const productId = String(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      group: true,
    },
  });

  if (!product) {
    throw new HttpError(404, 'Produto não encontrado.');
  }

  return res.json({ product });
}

export async function createProduct(req: Request, res: Response) {
  const data = createProductSchema.parse(req.body);

  const product = await prisma.product.create({
    data: mapProductData(data),
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

export async function updateProduct(req: Request, res: Response) {
  const productId = String(req.params.id);
  const data = createProductSchema.parse(req.body);

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new HttpError(404, 'Produto não encontrado.');
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: mapProductData(data),
    include: {
      category: true,
      group: true,
    },
  });

  return res.json({
    message: 'Produto atualizado com sucesso.',
    product,
  });
}

export async function deleteProduct(req: Request, res: Response) {
  const productId = String(req.params.id);

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new HttpError(404, 'Produto não encontrado.');
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new HttpError(400, 'Não é possível excluir este produto porque ele está vinculado a outros registros.');
    }

    throw error;
  }

  return res.json({
    message: 'Produto excluído com sucesso.',
  });
}
