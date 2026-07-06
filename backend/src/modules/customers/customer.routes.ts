import { Router } from 'express';
import { createCustomer, listCustomers } from './customer.controller';

export const customerRouter = Router();

customerRouter.get('/', listCustomers);
customerRouter.post('/', createCustomer);
