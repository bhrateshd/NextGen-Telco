/**
 * Auth Middleware
 * Verifies JWT tokens
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nextgen-telco-secret-key-change-in-prod';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Missing authorization token');
      err.statusCode = 401;
      err.code = 'MISSING_TOKEN';
      return next(err);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token expired');
      err.statusCode = 401;
      err.code = 'TOKEN_EXPIRED';
      return next(err);
    }

    const err = new Error('Invalid token');
    err.statusCode = 401;
    err.code = 'INVALID_TOKEN';
    next(err);
  }
};

module.exports = authMiddleware;
