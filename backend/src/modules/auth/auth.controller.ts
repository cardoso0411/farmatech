import { Request, Response } from 'express';
import { scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createAccessToken } from './auth.token';

const scrypt = promisify(scryptCallback);

async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedKey] = passwordHash.split(':');
  if (!salt || !storedKey) return false;
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return timingSafeEqual(derivedKey, Buffer.from(storedKey, 'hex'));
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username?.trim() || !password) throw new HttpError(400, 'Informe usuário e senha.');

  const seller = await prisma.seller.findUnique({ where: { username: username.trim() } });
  if (!seller?.passwordHash || !seller.isActive || !(await verifyPassword(password, seller.passwordHash))) {
    throw new HttpError(401, 'Usuário ou senha inválidos.');
  }

  const user = { id: seller.id, name: seller.name, username: seller.username!, role: seller.role };
  return res.json({ token: createAccessToken(user), user });
}
