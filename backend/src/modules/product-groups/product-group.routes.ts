import { Router } from 'express';
import { createProductGroup, listProductGroups } from './product-group.controller';
import { requireAdmin } from '../../middlewares/auth';

export const productGroupRouter = Router();

productGroupRouter.get('/', listProductGroups);
productGroupRouter.post('/', requireAdmin, createProductGroup);
