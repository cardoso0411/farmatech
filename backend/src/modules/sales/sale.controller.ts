import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createSaleSchema } from './sale.schemas';

function toMoney(value: number) {
  return Number(value.toFixed(2));
}

export async function listSales(_req: Request, res: Response) {
  const sales = await prisma.sale.findMany({
    include: {
      customer: true,
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json({ sales });
}

export async function createSale(req: Request, res: Response) {
  const data = createSaleSchema.parse(req.body);

  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new HttpError(400, 'Um ou mais produtos não foram encontrados.');
  }

  const subtotal = toMoney(
    data.items.reduce((accumulator, item) => accumulator + item.unitPrice * item.quantity, 0)
  );
  const itemDiscountTotal = toMoney(
    data.items.reduce((accumulator, item) => accumulator + item.discount, 0)
  );
  const totalAmount = toMoney(subtotal - itemDiscountTotal - data.discountAmount);
  const paymentTotal = toMoney(
    data.payments.reduce((accumulator, payment) => accumulator + payment.amount, 0)
  );

  if (paymentTotal < totalAmount) {
    throw new HttpError(400, 'O valor pago é menor que o total da venda.');
  }

  const sale = await prisma.$transaction(async (transaction) => {
    for (const item of data.items) {
      const product = products.find((currentProduct) => currentProduct.id === item.productId);

      if (!product) {
        throw new HttpError(400, 'Produto inválido na venda.');
      }

      if (product.stockQuantity < item.quantity) {
        throw new HttpError(400, `Estoque insuficiente para ${product.name}.`);
      }
    }

    const createdSale = await transaction.sale.create({
      data: {
        customerId: data.customerId,
        userId: data.userId,
        notes: data.notes,
        subtotal,
        discountAmount: toMoney(data.discountAmount + itemDiscountTotal),
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            totalPrice: toMoney(item.unitPrice * item.quantity - item.discount),
          })),
        },
        payments: {
          create: data.payments.map((payment) => ({
            method: payment.method,
            amount: payment.amount,
            reference: payment.reference,
          })),
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    for (const item of data.items) {
      const product = products.find((currentProduct) => currentProduct.id === item.productId)!;

      await transaction.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stockQuantity: product.stockQuantity - item.quantity,
        },
      });

      await transaction.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'SALE',
          quantity: -item.quantity,
          reason: `Venda ${createdSale.saleNumber}`,
        },
      });
    }

    return createdSale;
  });

  return res.status(201).json({
    message: 'Venda registrada com sucesso.',
    sale,
  });
}
