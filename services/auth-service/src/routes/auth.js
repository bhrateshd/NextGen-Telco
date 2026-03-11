/**
 * Auth Routes
 */

const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /auth/token
 * Generate JWT token
 */
router.post('/token', (req, res, next) => {
  try {
    const { userId, email, role } = req.body;

    if (!userId || !email) {
      const err = new Error('Missing userId or email');
      err.statusCode = 400;
      return next(err);
    }

    const token = AuthController.generateToken({
      userId,
      email,
      role: role || 'user'
    });

    res.json({
      status: 'success',
      token,
      expiresIn: process.env.JWT_EXPIRY || '24h'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/verify
 * Verify JWT token
 */
router.post('/verify', (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      const err = new Error('Token is required');
      err.statusCode = 400;
      return next(err);
    }

    const decoded = AuthController.verifyToken(token);

    res.json({
      status: 'success',
      valid: true,
      payload: decoded
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: 'error',
      code: error.code,
      message: error.message,
      valid: false
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      const err = new Error('Token is required');
      err.statusCode = 400;
      return next(err);
    }

    const newToken = AuthController.refreshToken(token);

    res.json({
      status: 'success',
      token: newToken,
      expiresIn: process.env.JWT_EXPIRY || '24h'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/hash
 * Hash password
 */
router.post('/hash', async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      const err = new Error('Password is required');
      err.statusCode = 400;
      return next(err);
    }

    const hash = await AuthController.hashPassword(password);

    res.json({
      status: 'success',
      hash
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
