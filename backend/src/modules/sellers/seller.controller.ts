import { Request, Response } from 'express';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { prisma } from '../../lib/prisma';
import { createSellerSchema } from './seller.schemas';

const scrypt = promisify(scryptCallback);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function listSellers(_req: Request, res: Response) {
  const sellers = await prisma.seller.findMany({
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
