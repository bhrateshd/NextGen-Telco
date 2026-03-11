/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 */

const errorHandler = (err, req, res, next) => {
  const errorId = req.id || 'unknown';
  const timestamp = new Date().toISOString();

  // Default error
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Internal Server Error';

  // Log error
  console.error(`[${timestamp}] Error ID: ${errorId}`);
  console.error(`Method: ${req.method} ${req.path}`);
  console.error(`Status: ${statusCode} - ${errorCode}`);
  console.error(`Message: ${message}`);
  if (err.stack) console.error(`Stack: ${err.stack}`);

  // Handle specific error types
  if (err.statusCode === 400) {
    errorCode = 'INVALID_REQUEST';
    message = err.message || 'Request validation failed';
  } else if (err.statusCode === 401) {
    errorCode = 'AUTHENTICATION_FAILED';
    message = 'Authentication required or token invalid';
  } else if (err.statusCode === 403) {
    errorCode = 'FORBIDDEN';
    message = 'You do not have permission to access this resource';
  } else if (err.statusCode === 404) {
    errorCode = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (err.statusCode === 409) {
    errorCode = 'CONFLICT';
    message = 'Resource already exists or conflict occurred';
  } else if (err.statusCode === 429) {
    errorCode = 'RATE_LIMITED';
    message = 'Too many requests, please try again later';
    statusCode = 429;
  } else if (statusCode >= 500) {
    errorCode = 'SERVICE_ERROR';
    message = err.message || 'An error occurred while processing your request';
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    code: errorCode,
    message: message,
    requestId: errorId,
    timestamp: timestamp,
    ...(process.env.NODE_ENV === 'development' && { details: err.details })
  });
};

module.exports = errorHandler;
