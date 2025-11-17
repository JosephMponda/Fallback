import express from 'express';
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
} from '../controllers/quoteController.js';
import { protect, authorize } from '../middleware/auth.js';
import { quoteValidation, uuidValidation, validate } from '../middleware/validator.js';
import { emailLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', emailLimiter, quoteValidation, validate, createQuote);
router.get('/', protect, getAllQuotes);
router.get('/:id', protect, uuidValidation, validate, getQuoteById);
router.put('/:id/status', protect, authorize('ADMIN'), uuidValidation, validate, updateQuoteStatus);

export default router;
