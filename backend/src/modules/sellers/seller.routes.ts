import { Router } from 'express';
import { createSeller, deleteSeller, listSellers, updateSeller } from './seller.controller';
import { requireAdmin } from '../../middlewares/auth';

export const sellerRouter = Router();

sellerRouter.get('/', listSellers);
sellerRouter.post('/', requireAdmin, createSeller);
sellerRouter.put('/:id', requireAdmin, updateSeller);
sellerRouter.delete('/:id', requireAdmin, deleteSeller);
