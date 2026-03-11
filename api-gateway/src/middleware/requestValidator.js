/**
 * Request Validator Middleware
 * Validates incoming requests
 */

const requestValidator = (req, res, next) => {
  // Skip validation for health checks
  if (req.path === '/health' || req.path === '/ready' || req.path === '/') {
    return next();
  }

  // Validate Content-Type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      const err = new Error('Content-Type must be application/json');
      err.statusCode = 400;
      return next(err);
    }
  }

  // Validate request body size
  if (req.headers['content-length']) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (parseInt(req.headers['content-length']) > maxSize) {
      const err = new Error('Request body too large');
      err.statusCode = 413;
      return next(err);
    }
  }

  next();
};

module.exports = requestValidator;
