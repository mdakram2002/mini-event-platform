// const { body, param, validationResult } = require('express-validator');

// // User validation rules
// const userValidationRules = () => {
//   return [
//     body('name')
//       .trim()
//       .notEmpty().withMessage('Name is required')
//       .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
//       .matches(/^[a-zA-Z\s]*$/).withMessage('Name can only contain letters and spaces'),

//     body('email')
//       .trim()
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Please provide a valid email')
//       .normalizeEmail(),

//     body('password')
//       .notEmpty().withMessage('Password is required')
//       .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
//       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//       .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

//     body('confirmPassword')
//       .custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error('Passwords do not match');
//         }
//         return true;
//       })
//   ];
// };

// // Event validation rules
// const eventValidationRules = () => {
//   return [
//     body('title')
//       .trim()
//       .notEmpty().withMessage('Title is required')
//       .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

//     body('description')
//       .trim()
//       .notEmpty().withMessage('Description is required')
//       .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

//     body('dateTime')
//       .notEmpty().withMessage('Date and time are required')
//       .isISO8601().withMessage('Please provide a valid date and time')
//       .custom((value) => {
//         const eventDate = new Date(value);
//         const now = new Date();
//         if (eventDate <= now) {
//           throw new Error('Event date must be in the future');
//         }
//         return true;
//       }),

//     body('location')
//       .trim()
//       .notEmpty().withMessage('Location is required')
//       .isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters'),

//     body('capacity')
//       .notEmpty().withMessage('Capacity is required')
//       .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10000')
//       .toInt(),

//     body('image')
//       .optional()
//       .custom((value, { req }) => {
//         if (req.file) {
//           const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//           if (!allowedMimeTypes.includes(req.file.mimetype)) {
//             throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
//           }

//           const maxSize = 5 * 1024 * 1024; // 5MB
//           if (req.file.size > maxSize) {
//             throw new Error('Image size must be less than 5MB');
//           }
//         }
//         return true;
//       })
//   ];
// };

// // Event update validation rules (all fields optional)
// const eventUpdateValidationRules = () => {
//   return [
//     body('title')
//       .optional()
//       .trim()
//       .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

//     body('description')
//       .optional()
//       .trim()
//       .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

//     body('dateTime')
//       .optional()
//       .isISO8601().withMessage('Please provide a valid date and time')
//       .custom((value) => {
//         const eventDate = new Date(value);
//         const now = new Date();
//         if (eventDate <= now) {
//           throw new Error('Event date must be in the future');
//         }
//         return true;
//       }),

//     body('location')
//       .optional()
//       .trim()
//       .isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters'),

//     body('capacity')
//       .optional()
//       .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10000')
//       .custom((value, { req }) => {
//         // If updating capacity, ensure it's not less than current attendees
//         if (req.event && req.event.attendees && value < req.event.attendees.length) {
//           throw new Error(`Capacity cannot be less than current attendees (${req.event.attendees.length})`);
//         }
//         return true;
//       })
//       .toInt(),

//     body('image')
//       .optional()
//       .custom((value, { req }) => {
//         if (req.file) {
//           const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//           if (!allowedMimeTypes.includes(req.file.mimetype)) {
//             throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
//           }

//           const maxSize = 5 * 1024 * 1024; // 5MB
//           if (req.file.size > maxSize) {
//             throw new Error('Image size must be less than 5MB');
//           }
//         }
//         return true;
//       })
//   ];
// };

// // Login validation rules
// const loginValidationRules = () => {
//   return [
//     body('email')
//       .trim()
//       .notEmpty().withMessage('Email is required')
//       .isEmail().withMessage('Please provide a valid email')
//       .normalizeEmail(),

//     body('password')
//       .notEmpty().withMessage('Password is required')
//   ];
// };

// // ObjectId validation for MongoDB
// const mongoIdValidation = () => {
//   return [
//     param('id')
//       .notEmpty().withMessage('ID is required')
//       .isMongoId().withMessage('Invalid ID format')
//   ];
// };

// // RSVP validation rules
// const rsvpValidationRules = () => {
//   return [
//     param('eventId')
//       .notEmpty().withMessage('Event ID is required')
//       .isMongoId().withMessage('Invalid Event ID format')
//   ];
// };

// // Validate request middleware
// const validate = (req, res, next) => {
//   const errors = validationResult(req);

//   if (errors.isEmpty()) {
//     return next();
//   }

//   const extractedErrors = [];
//   errors.array().map(err => extractedErrors.push({
//     [err.path]: err.msg
//   }));

//   return res.status(422).json({
//     success: false,
//     errors: extractedErrors
//   });
// };

// // Async handler wrapper for controllers
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // Custom validation error class
// class ValidationError extends Error {
//   constructor(message, errors = []) {
//     super(message);
//     this.name = 'ValidationError';
//     this.errors = errors;
//     this.statusCode = 400;
//     this.isOperational = true;
//   }
// }

// // Custom authentication error class
// class AuthenticationError extends Error {
//   constructor(message = 'Authentication failed') {
//     super(message);
//     this.name = 'AuthenticationError';
//     this.statusCode = 401;
//     this.isOperational = true;
//   }
// }

// // Custom authorization error class
// class AuthorizationError extends Error {
//   constructor(message = 'Not authorized') {
//     super(message);
//     this.name = 'AuthorizationError';
//     this.statusCode = 403;
//     this.isOperational = true;
//   }
// }

// // Custom not found error class
// class NotFoundError extends Error {
//   constructor(message = 'Resource not found') {
//     super(message);
//     this.name = 'NotFoundError';
//     this.statusCode = 404;
//     this.isOperational = true;
//   }
// }

// // Custom conflict error class
// class ConflictError extends Error {
//   constructor(message = 'Resource already exists') {
//     super(message);
//     this.name = 'ConflictError';
//     this.statusCode = 409;
//     this.isOperational = true;
//   }
// }

// module.exports = {
//   userValidationRules,
//   eventValidationRules,
//   eventUpdateValidationRules,
//   loginValidationRules,
//   mongoIdValidation,
//   rsvpValidationRules,
//   validate,
//   asyncHandler,
//   ValidationError,
//   AuthenticationError,
//   AuthorizationError,
//   NotFoundError,
//   ConflictError
// };