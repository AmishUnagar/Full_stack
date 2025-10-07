import { Router } from 'express';
import { body } from 'express-validator';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get user's orders
router.get('/', requireAuth, getOrders);

// Get specific order
router.get('/:orderId', requireAuth, getOrderById);

// Create new order
router.post('/', requireAuth, [
  body('items').isArray().notEmpty(),
  body('total').isNumeric(),
  body('shippingAddress').isObject()
], createOrder);

// Update order status (admin only - for now allowing user to update)
router.put('/:orderId/status', requireAuth, [
  body('status').isIn(['processing', 'shipped', 'delivered', 'cancelled'])
], updateOrderStatus);

export default router;