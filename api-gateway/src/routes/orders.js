/**
 * Order Service Routes
 * Routes for order management and fulfillment
 */

const express = require('express');
const { proxyRequest } = require('../utils/serviceProxy');

const router = express.Router();

/**
 * POST /api/orders
 * Create new order
 */
router.post('/', async (req, res, next) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      const err = new Error('Missing required fields: userId, items (non-empty array)');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'order', '/');
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/:orderId
 * Get order details
 */
router.get('/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      const err = new Error('Order ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'order', `/${orderId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/user/:userId
 * Get user orders
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'order', `/user/${userId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/orders/:orderId
 * Update order status or details
 */
router.put('/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      const err = new Error('Order ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'order', `/${orderId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/orders/:orderId
 * Cancel order
 */
router.delete('/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      const err = new Error('Order ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const result = await proxyRequest(req, 'order', `/${orderId}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
