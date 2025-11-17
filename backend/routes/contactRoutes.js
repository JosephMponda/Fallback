import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  markMessageAsRead,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { contactValidation, uuidValidation, validate } from '../middleware/validator.js';
import { emailLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', emailLimiter, contactValidation, validate, createContactMessage);
router.get('/', protect, authorize('ADMIN'), getAllContactMessages);
router.get('/:id', protect, authorize('ADMIN'), uuidValidation, validate, getContactMessageById);
router.put('/:id/read', protect, authorize('ADMIN'), uuidValidation, validate, markMessageAsRead);
router.delete('/:id', protect, authorize('ADMIN'), uuidValidation, validate, deleteContactMessage);

export default router;
