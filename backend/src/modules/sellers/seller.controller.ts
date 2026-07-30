import { Request, Response } from 'express';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { prisma } from '../../lib/prisma';
import { createSellerSchema, updateSellerSchema } from './seller.schemas';

const scrypt = promisify(scryptCallback);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function listSellers(_req: Request, res: Response) {
  const sellers = await prisma.seller.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      username: true,
      role: true,
      cpf: true,
      rg: true,
      zipCode: true,
      address: true,
      district: true,
      city: true,
      state: true,
      mobilePhone: true,
      phone: true,
      email: true,
      observation: true,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return res.json({ sellers });
}

export async function createSeller(req: Request, res: Response) {
  const data = createSellerSchema.parse(req.body);
  const { password, ...sellerData } = data;

  const seller = await prisma.seller.create({
    data: {
      ...sellerData,
      email: sellerData.email || null,
      phone: sellerData.phone || null,
      observation: sellerData.observation || null,
      passwordHash: await hashPassword(password),
    },
  });

  return res.status(201).json({
    message: 'Vendedor cadastrado com sucesso.',
    seller,
  });
}

export async function updateSeller(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data = updateSellerSchema.parse(req.body);
  const { password, ...sellerData } = data;

  const seller = await prisma.seller.update({
    where: { id },
    data: {
      ...sellerData,
      email: sellerData.email || null,
      phone: sellerData.phone || null,
      observation: sellerData.observation || null,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  });

  return res.json({ message: 'Usuário atualizado com sucesso.', seller });
}

export async function deleteSeller(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  await prisma.$transaction([
    prisma.customer.updateMany({ where: { sellerId: id }, data: { sellerId: null } }),
    prisma.seller.delete({ where: { id } }),
  ]);

  return res.status(204).send();
}
