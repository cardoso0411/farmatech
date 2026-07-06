import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createCustomerSchema } from './customer.schemas';

export async function listCustomers(_req: Request, res: Response) {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json({ customers });
}

export async function createCustomer(req: Request, res: Response) {
  const data = createCustomerSchema.parse(req.body);

  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      cpfCnpj: data.cpfCnpj,
      phone: data.phone,
      email: data.email,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      insurance: data.insurance,
      notes: data.notes,
    },
  });

  return res.status(201).json({
    message: 'Cliente cadastrado com sucesso.',
    customer,
  });
}
