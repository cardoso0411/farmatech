import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createCustomerSchema } from './customer.schemas';

function mapCustomerData(data: ReturnType<typeof createCustomerSchema.parse>) {
  return {
    personType: data.personType,
    customerTypeId: data.customerTypeId,
    fullName: data.fullName,
    tradeName: data.tradeName,
    legalName: data.legalName,
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
  };
}

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

export async function getCustomerById(req: Request, res: Response) {
  const customerId = String(req.params.id);

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      customerType: true,
      seller: true,
    },
  });

  if (!customer) {
    throw new HttpError(404, 'Cliente não encontrado.');
  }

  return res.json({ customer });
}

export async function createCustomer(req: Request, res: Response) {
  const data = createCustomerSchema.parse(req.body);

  const customer = await prisma.customer.create({
    data: mapCustomerData(data),
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

export async function updateCustomer(req: Request, res: Response) {
  const customerId = String(req.params.id);
  const data = createCustomerSchema.parse(req.body);

  const existingCustomer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!existingCustomer) {
    throw new HttpError(404, 'Cliente não encontrado.');
  }

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: mapCustomerData(data),
    include: {
      customerType: true,
      seller: true,
    },
  });

  return res.json({
    message: 'Cliente atualizado com sucesso.',
    customer,
  });
}

export async function deleteCustomer(req: Request, res: Response) {
  const customerId = String(req.params.id);

  const existingCustomer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!existingCustomer) {
    throw new HttpError(404, 'Cliente não encontrado.');
  }

  try {
    await prisma.customer.delete({
      where: { id: customerId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new HttpError(400, 'Não é possível excluir este cliente porque ele está vinculado a outros registros.');
    }

    throw error;
  }

  return res.json({
    message: 'Cliente excluído com sucesso.',
  });
}
