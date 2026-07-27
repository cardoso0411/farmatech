import { Router } from 'express';
import {
  createPaymentMethodConfig,
  deletePaymentMethodConfig,
  listPaymentMethodConfigs,
} from './payment-method-config.controller';

export const paymentMethodConfigRouter = Router();

paymentMethodConfigRouter.get('/', listPaymentMethodConfigs);
paymentMethodConfigRouter.post('/', createPaymentMethodConfig);
paymentMethodConfigRouter.delete('/:id', deletePaymentMethodConfig);
