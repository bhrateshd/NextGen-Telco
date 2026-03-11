/**
 * Rate Limiter Middleware
 * Limits requests per IP address
 */

const rateLimit = require('express-rate-limit');

// In-memory store for rate limiting (for production, use Redis)
const store = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = process.env.RATE_LIMIT_MAX || 100;

const rateLimiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();

  if (!store[key]) {
    store[key] = [];
  }

  // Remove old requests outside the window
  store[key] = store[key].filter(timestamp => now - timestamp < WINDOW_MS);

  if (store[key].length >= MAX_REQUESTS) {
    const err = new Error('Too many requests');
    err.statusCode = 429;
    err.code = 'RATE_LIMITED';
    return next(err);
  }

  store[key].push(now);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - store[key].length);
  res.setHeader('X-RateLimit-Reset', new Date(now + WINDOW_MS).toISOString());

  next();
};

module.exports = rateLimiter;
