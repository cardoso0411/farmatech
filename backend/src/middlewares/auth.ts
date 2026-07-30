import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error';
import { AuthUser, verifyAccessToken } from '../modules/auth/auth.token';

declare global { namespace Express { interface Request { authUser?: AuthUser } } }

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const user = token ? verifyAccessToken(token) : null;
  if (!user) return next(new HttpError(401, 'Faça login para acessar o sistema.'));
  req.authUser = user;
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.authUser?.role !== 'ADMIN') return next(new HttpError(403, 'Acesso permitido apenas para administradores.'));
  next();
}
