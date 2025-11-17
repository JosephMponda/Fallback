import express from 'express';
import {
  getAllGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { galleryValidation, uuidValidation, validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getAllGalleryItems);
router.get('/:id', uuidValidation, validate, getGalleryItemById);
router.post('/', protect, authorize('ADMIN'), galleryValidation, validate, createGalleryItem);
router.put('/:id', protect, authorize('ADMIN'), uuidValidation, validate, updateGalleryItem);
router.delete('/:id', protect, authorize('ADMIN'), uuidValidation, validate, deleteGalleryItem);

export default router;
