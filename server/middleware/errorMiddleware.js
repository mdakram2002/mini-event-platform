// const { ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError } = require('../utils/validation');

// // Custom error class for operational errors
// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// // 404 Not Found handler
// const notFound = (req, res, next) => {
//   const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
//   next(error);
// };

// // Global error handling middleware
// const errorHandler = (err, req, res, next) => {
//   // Default error values
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   err.message = err.message || 'Internal Server Error';

//   // Log error in development
//   if (process.env.NODE_ENV === 'development') {
//     console.error('Error:', {
//       name: err.name,
//       message: err.message,
//       stack: err.stack,
//       statusCode: err.statusCode,
//       path: req.path,
//       method: req.method,
//       body: req.body,
//       params: req.params,
//       query: req.query,
//       user: req.user ? req.user.id : 'Unauthenticated'
//     });
//   }

//   // Production error logging (without sensitive info)
//   if (process.env.NODE_ENV === 'production') {
//     console.error('Production Error:', {
//       name: err.name,
//       message: err.message,
//       statusCode: err.statusCode,
//       path: req.path,
//       method: req.method
//     });
//   }

//   // Handle specific error types
//   let errorResponse = {
//     success: false,
//     status: err.status,
//     message: err.message
//   };

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const errors = Object.values(err.errors).map(el => ({
//       field: el.path,
//       message: el.message
//     }));

//     errorResponse = {
//       success: false,
//       message: 'Validation failed',
//       errors: errors
//     };
//     err.statusCode = 400;
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     const value = err.keyValue[field];
//     errorResponse.message = `Duplicate field value: ${value}. Please use another value.`;
//     err.statusCode = 400;
//   }

//   // Mongoose CastError (invalid ObjectId)
//   if (err.name === 'CastError') {
//     errorResponse.message = `Invalid ${err.path}: ${err.value}`;
//     err.statusCode = 400;
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     errorResponse.message = 'Invalid token. Please log in again.';
//     err.statusCode = 401;
//   }

//   if (err.name === 'TokenExpiredError') {
//     errorResponse.message = 'Your token has expired. Please log in again.';
//     err.statusCode = 401;
//   }

//   // Multer errors
//   if (err.name === 'MulterError') {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       errorResponse.message = 'File size is too large. Maximum size is 5MB.';
//     } else if (err.code === 'LIMIT_FILE_TYPE') {
//       errorResponse.message = 'Invalid file type. Only images are allowed.';
//     } else {
//       errorResponse.message = 'File upload failed.';
//     }
//     err.statusCode = 400;
//   }

//   // Custom error types
//   if (err instanceof ValidationError) {
//     errorResponse = {
//       success: false,
//       message: err.message || 'Validation failed',
//       errors: err.errors || []
//     };
//   }

//   if (err instanceof AuthenticationError) {
//     errorResponse.message = err.message || 'Authentication failed';
//   }

//   if (err instanceof AuthorizationError) {
//     errorResponse.message = err.message || 'Not authorized';
//   }

//   if (err instanceof NotFoundError) {
//     errorResponse.message = err.message || 'Resource not found';
//   }

//   if (err instanceof ConflictError) {
//     errorResponse.message = err.message || 'Resource conflict';
//   }

//   // Include stack trace in development
//   if (process.env.NODE_ENV === 'development') {
//     errorResponse.stack = err.stack;
//     errorResponse.error = err;
//   }

//   // Send error response
//   res.status(err.statusCode).json(errorResponse);
// };

// // Async error wrapper for controllers
// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

// // Error types for different scenarios
// const errorTypes = {
//   // 400 Bad Request
//   badRequest: (message = 'Bad request') => {
//     const error = new AppError(message, 400);
//     return error;
//   },

//   // 401 Unauthorized
//   unauthorized: (message = 'Unauthorized access') => {
//     const error = new AppError(message, 401);
//     return error;
//   },

//   // 403 Forbidden
//   forbidden: (message = 'Forbidden') => {
//     const error = new AppError(message, 403);
//     return error;
//   },

//   // 404 Not Found
//   notFound: (message = 'Resource not found') => {
//     const error = new AppError(message, 404);
//     return error;
//   },

//   // 409 Conflict
//   conflict: (message = 'Resource already exists') => {
//     const error = new AppError(message, 409);
//     return error;
//   },

//   // 422 Unprocessable Entity
//   unprocessableEntity: (message = 'Unprocessable entity') => {
//     const error = new AppError(message, 422);
//     return error;
//   },

//   // 429 Too Many Requests
//   tooManyRequests: (message = 'Too many requests') => {
//     const error = new AppError(message, 429);
//     return error;
//   },

//   // 500 Internal Server Error
//   internalServerError: (message = 'Internal server error') => {
//     const error = new AppError(message, 500);
//     return error;
//   },

//   // 503 Service Unavailable
//   serviceUnavailable: (message = 'Service unavailable') => {
//     const error = new AppError(message, 503);
//     return error;
//   }
// };

// // Rate limiting error
// const rateLimitError = (message = 'Too many requests, please try again later.') => {
//   const error = new AppError(message, 429);
//   return error;
// };

// // Database connection error
// const databaseError = (message = 'Database connection error') => {
//   const error = new AppError(message, 500);
//   return error;
// };

// // File upload error
// const fileUploadError = (message = 'File upload failed') => {
//   const error = new AppError(message, 400);
//   return error;
// };

// // Validation error handler
// const handleValidationError = (err) => {
//   const errors = Object.values(err.errors).map(el => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

// // Duplicate key error handler
// const handleDuplicateKeyError = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const message = `Duplicate field value: ${value}. Please use another value.`;
//   return new AppError(message, 400);
// };

// // Cast error handler
// const handleCastError = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
// };

// // JWT error handler
// const handleJWTError = () => {
//   return new AppError('Invalid token. Please log in again.', 401);
// };

// // JWT expired error handler
// const handleJWTExpiredError = () => {
//   return new AppError('Your token has expired. Please log in again.', 401);
// };

// // Handle production errors (hide sensitive info)
// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       success: false,
//       status: err.status,
//       message: err.message
//     });
//   }
//   // Programming or unknown error: don't leak error details
//   else {
//     // 1) Log error
//     console.error('ERROR', err);

//     // 2) Send generic message
//     res.status(500).json({
//       success: false,
//       status: 'error',
//       message: 'Something went wrong!'
//     });
//   }
// };

// // Handle development errors (show everything)
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     success: false,
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

// module.exports = {
//   AppError,
//   notFound,
//   errorHandler,
//   catchAsync,
//   errorTypes,
//   rateLimitError,
//   databaseError,
//   fileUploadError,
//   handleValidationError,
//   handleDuplicateKeyError,
//   handleCastError,
//   handleJWTError,
//   handleJWTExpiredError,
//   sendErrorProd,
//   sendErrorDev
// };