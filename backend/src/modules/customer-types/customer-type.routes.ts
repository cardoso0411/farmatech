import { Router } from 'express';
import { createCustomerType, listCustomerTypes } from './customer-type.controller';

export const customerTypeRouter = Router();

customerTypeRouter.get('/', listCustomerTypes);
customerTypeRouter.post('/', createCustomerType);
