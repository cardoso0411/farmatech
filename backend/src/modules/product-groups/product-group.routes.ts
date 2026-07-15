import { Router } from 'express';
import { createProductGroup, listProductGroups } from './product-group.controller';

export const productGroupRouter = Router();

productGroupRouter.get('/', listProductGroups);
productGroupRouter.post('/', createProductGroup);
