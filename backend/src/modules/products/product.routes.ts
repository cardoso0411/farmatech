import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from './product.controller';
import { requireAdmin } from '../../middlewares/auth';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', requireAdmin, createProduct);
productRouter.put('/:id', requireAdmin, updateProduct);
productRouter.delete('/:id', requireAdmin, deleteProduct);
