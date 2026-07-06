import { Router } from 'express';
import { createSale, listSales } from './sale.controller';

export const saleRouter = Router();

saleRouter.get('/', listSales);
saleRouter.post('/', createSale);
