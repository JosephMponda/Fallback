import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
