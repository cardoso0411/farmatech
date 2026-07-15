import { Router } from 'express';
import { createProductCategory, listProductCategories } from './product-category.controller';

export const productCategoryRouter = Router();

productCategoryRouter.get('/', listProductCategories);
productCategoryRouter.post('/', createProductCategory);
