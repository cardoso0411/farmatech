import { Router } from 'express';
import { createSale, listSales } from './sale.controller';
import { requireAdmin } from '../../middlewares/auth';

export const saleRouter = Router();

saleRouter.get('/', requireAdmin, listSales);
saleRouter.post('/', createSale);
