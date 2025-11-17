import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { serviceValidation, uuidValidation, validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', uuidValidation, validate, getServiceById);
router.post('/', protect, authorize('ADMIN'), serviceValidation, validate, createService);
router.put('/:id', protect, authorize('ADMIN'), uuidValidation, validate, updateService);
router.delete('/:id', protect, authorize('ADMIN'), uuidValidation, validate, deleteService);

export default router;
