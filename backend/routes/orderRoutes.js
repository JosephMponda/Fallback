import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createPaymentIntent,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { orderValidation, uuidValidation, validate } from '../middleware/validator.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', orderValidation, validate, createOrder);
router.get('/', protect, getAllOrders);
router.get('/:id', protect, uuidValidation, validate, getOrderById);
router.put('/:id/status', protect, authorize('ADMIN'), uuidValidation, validate, updateOrderStatus);
router.post('/payment-intent', paymentLimiter, protect, createPaymentIntent);

export default router;
