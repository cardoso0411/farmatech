import { Router } from 'express';
import { createCustomerType, listCustomerTypes } from './customer-type.controller';
import { requireAdmin } from '../../middlewares/auth';

export const customerTypeRouter = Router();

customerTypeRouter.get('/', listCustomerTypes);
customerTypeRouter.post('/', requireAdmin, createCustomerType);
