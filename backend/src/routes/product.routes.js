import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', list);
router.get('/:id', getById);

// admin-only examples (for now require auth; you can add role check later)
router.post('/', requireAuth, create);
router.put('/:id', requireAuth, update);
router.delete('/:id', requireAuth, remove);

export default router;


