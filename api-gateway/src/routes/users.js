/**
 * User Service Routes
 * Routes for user management, authentication, and profiles
 */

const express = require('express');
const { proxyRequest } = require('../utils/serviceProxy');

const router = express.Router();

/**
 * POST /api/users/register
 * Register new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      const err = new Error('Missing required fields: firstName, lastName, email, password');
      err.statusCode = 400;
      return next(err);
    }

    if (password.length < 8) {
      const err = new Error('Password must be at least 8 characters');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'user', '/register');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users/login
 * User login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Missing email or password');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'user', '/login');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/profile/:userId
 * Get user profile
 */
router.get('/profile/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'user', `/profile/${userId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/profile/:userId
 * Update user profile
 */
router.put('/profile/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'user', `/profile/${userId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:userId
 * Get user details
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'user', `/${userId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
