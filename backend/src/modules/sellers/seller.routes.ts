import { Router } from 'express';
import { createSeller, listSellers } from './seller.controller';

export const sellerRouter = Router();

sellerRouter.get('/', listSellers);
sellerRouter.post('/', createSeller);
