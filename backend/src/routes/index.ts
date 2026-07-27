import { Router } from 'express';
import { customerTypeRouter } from '../modules/customer-types/customer-type.routes';
import { customerRouter } from '../modules/customers/customer.routes';
import { healthRouter } from '../modules/health/health.routes';
import { productRouter } from '../modules/products/product.routes';
import { productCategoryRouter } from '../modules/product-categories/product-category.routes';
import { productGroupRouter } from '../modules/product-groups/product-group.routes';
import { paymentMethodConfigRouter } from '../modules/payment-method-configs/payment-method-config.routes';
import { saleRouter } from '../modules/sales/sale.routes';
import { sellerRouter } from '../modules/sellers/seller.routes';

export const appRouter = Router();

appRouter.get('/', (_req, res) => {
  res.json({
    name: 'Farmatech API',
    version: '2.0.0',
  });
});

appRouter.use('/health', healthRouter);
appRouter.use('/customer-types', customerTypeRouter);
appRouter.use('/sellers', sellerRouter);
appRouter.use('/customers', customerRouter);
appRouter.use('/product-categories', productCategoryRouter);
appRouter.use('/product-groups', productGroupRouter);
appRouter.use('/payment-method-configs', paymentMethodConfigRouter);
appRouter.use('/products', productRouter);
appRouter.use('/sales', saleRouter);
