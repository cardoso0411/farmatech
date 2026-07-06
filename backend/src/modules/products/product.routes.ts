import { Router } from 'express';
import { createProduct, listProducts } from './product.controller';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.post('/', createProduct);
