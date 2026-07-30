import { Router } from 'express';
import {
  createPaymentMethodConfig,
  deletePaymentMethodConfig,
  listPaymentMethodConfigs,
} from './payment-method-config.controller';
import { requireAdmin } from '../../middlewares/auth';

export const paymentMethodConfigRouter = Router();

paymentMethodConfigRouter.get('/', listPaymentMethodConfigs);
paymentMethodConfigRouter.post('/', requireAdmin, createPaymentMethodConfig);
paymentMethodConfigRouter.delete('/:id', requireAdmin, deletePaymentMethodConfig);
