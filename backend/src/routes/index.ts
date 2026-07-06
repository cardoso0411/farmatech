import { Router } from 'express';
import { customerRouter } from '../modules/customers/customer.routes';
import { healthRouter } from '../modules/health/health.routes';
import { productRouter } from '../modules/products/product.routes';
import { saleRouter } from '../modules/sales/sale.routes';

export const appRouter = Router();

appRouter.get('/', (_req, res) => {
  res.json({
    name: 'Farmatech API',
    version: '2.0.0',
  });
});

appRouter.use('/health', healthRouter);
appRouter.use('/customers', customerRouter);
appRouter.use('/products', productRouter);
appRouter.use('/sales', saleRouter);
