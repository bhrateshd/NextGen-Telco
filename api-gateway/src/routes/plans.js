/**
 * Plan Service Routes
 * Routes for mobile plans management
 */

const express = require('express');
const { proxyRequest } = require('../utils/serviceProxy');

const router = express.Router();

/**
 * GET /api/plans
 * Get all plans with optional filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await proxyRequest(req, 'plan', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/plans/:planId
 * Get specific plan details
 */
router.get('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      const err = new Error('Plan ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'plan', `/${planId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/plans
 * Create new plan (admin only)
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, price, data, features } = req.body;

    if (!name || !price || !data) {
      const err = new Error('Missing required fields: name, price, data');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'plan', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/plans/:planId
 * Update plan details
 */
router.put('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      const err = new Error('Plan ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'plan', `/${planId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/plans/:planId
 * Delete plan
 */
router.delete('/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      const err = new Error('Plan ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'plan', `/${planId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
