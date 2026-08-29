import { Router } from 'express';
import { createCustomerType, deleteCustomerType, listCustomerTypes } from './customer-type.controller';
import { requireAdmin } from '../../middlewares/auth';

export const customerTypeRouter = Router();

customerTypeRouter.get('/', listCustomerTypes);
customerTypeRouter.post('/', requireAdmin, createCustomerType);
customerTypeRouter.delete('/:id', requireAdmin, deleteCustomerType);
