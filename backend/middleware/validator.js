import { validationResult, body, param, query } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Order validation rules
export const orderValidation = [
  body('serviceId').isUUID().withMessage('Invalid service ID'),
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customerPhone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('address').optional().trim(),
  body('specialRequests').optional().trim(),
];

// Quote validation rules
export const quoteValidation = [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customerPhone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('serviceType').trim().notEmpty().withMessage('Service type is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
];

// Contact validation rules
export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('subject').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// Service validation rules
export const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL required'),
  body('active').optional().isBoolean(),
];

// Gallery validation rules
export const galleryValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('imageUrl').isURL().withMessage('Valid image URL required'),
  body('category').optional().trim(),
  body('featured').optional().isBoolean(),
];

// UUID param validation
export const uuidValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
];
