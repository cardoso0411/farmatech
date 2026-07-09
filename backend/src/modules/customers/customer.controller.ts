import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createCustomerSchema } from './customer.schemas';

export async function listCustomers(_req: Request, res: Response) {
  const customers = await prisma.customer.findMany({
    include: {
      customerType: true,
      seller: true,
    },
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
      personType: data.personType,
      customerTypeId: data.customerTypeId,
      fullName: data.fullName,
      cpf: data.cpf,
      rg: data.rg,
      cnpj: data.cnpj,
      stateRegistration: data.stateRegistration,
      phone: data.phone,
      mobilePhone: data.mobilePhone,
      email: data.email,
      address: data.address,
      addressNumber: data.addressNumber,
      district: data.district,
      zipCode: data.zipCode,
      city: data.city,
      state: data.state,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      spcDate: data.spcDate ? new Date(data.spcDate) : undefined,
      isBlocked: data.isBlocked,
      hasSubscription: data.hasSubscription,
      classification: data.classification,
      sellerId: data.sellerId,
      status: data.status,
      isSupplier: data.isSupplier,
      insuranceOnly: data.insuranceOnly,
      insurance: data.insurance,
      notes: data.notes,
    },
    include: {
      customerType: true,
      seller: true,
    },
  });

  return res.status(201).json({
    message: 'Cliente cadastrado com sucesso.',
    customer,
  });
}
