import { Router } from 'express';
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  listCustomers,
  updateCustomer,
} from './customer.controller';
import { requireAdmin } from '../../middlewares/auth';

export const customerRouter = Router();

customerRouter.get('/', listCustomers);
customerRouter.get('/:id', getCustomerById);
customerRouter.post('/', createCustomer);
customerRouter.put('/:id', updateCustomer);
customerRouter.delete('/:id', requireAdmin, deleteCustomer);
