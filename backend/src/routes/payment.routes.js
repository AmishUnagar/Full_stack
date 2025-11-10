import { Router } from 'express';
import { createTestOrder, verifyTestPayment } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', requireAuth, createTestOrder);
router.post('/verify', requireAuth, verifyTestPayment);

export default router;


