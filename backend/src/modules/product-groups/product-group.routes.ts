import { Router } from 'express';
import { createProductGroup, deleteProductGroup, listProductGroups } from './product-group.controller';
import { requireAdmin } from '../../middlewares/auth';

export const productGroupRouter = Router();

productGroupRouter.get('/', listProductGroups);
productGroupRouter.post('/', requireAdmin, createProductGroup);
productGroupRouter.delete('/:id', requireAdmin, deleteProductGroup);
