import { Request, Response } from 'express';

export function getHealth(_req: Request, res: Response) {
  return res.json({
    status: 'ok',
    service: 'farmatech-api',
    timestamp: new Date().toISOString(),
  });
}
