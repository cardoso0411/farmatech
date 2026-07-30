import { Router } from 'express';
import { createProductCategory, listProductCategories } from './product-category.controller';
import { requireAdmin } from '../../middlewares/auth';

export const productCategoryRouter = Router();

productCategoryRouter.get('/', listProductCategories);
productCategoryRouter.post('/', requireAdmin, createProductCategory);
